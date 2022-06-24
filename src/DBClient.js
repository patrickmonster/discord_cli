'use strict';
const Client = require('./Client')

const fs = require('fs');
const path = require("path");

// const updateCode = require("./Util/updateCode");

const ColumnType = require("./Util/DBColumn")

const { Sequelize, DataTypes, QueryTypes } = require('sequelize');
// Sequelize.DATA
/* ============================================================================================ */
const tables = {
	Channel : {
		id : ColumnType.id
		,name : ColumnType.CHAR(100)
		,type : ColumnType.CHAR(20)
		,createAt : ColumnType.createAt
		,isDeleted : ColumnType.Bool()
		,guild_id : ColumnType.CHAR(20, 'DM')
		,parentId : ColumnType.CHAR(20)
		,editAt : ColumnType.createAt
	},
	Cache : {
		key : {
			type : DataTypes.CHAR(100),
			primaryKey : true,
			allowNull : false
		},
		value : ColumnType.TEXT,
	},
	Guild : {
		id : ColumnType.id
		, name : ColumnType.CHAR(100)
		, ownerId : ColumnType.CHAR(20)
		, joinedTimestamp : ColumnType.createAt
		, isDeleted : ColumnType.Bool()
	},
	ServerLog : {
		timeAt : ColumnType.createAt
		, owner : DataTypes.CHAR(20)
		, msg : DataTypes.TEXT(65535)
		, type : DataTypes.CHAR(2)
	},
	User : {
		id : ColumnType.id
		, bot : ColumnType.CHAR(1, 'N')
		, accentColor : ColumnType.INTEGER()
		, tag : ColumnType.CHAR(200)
		, username : ColumnType.CHAR(100)
		, avatar : ColumnType.CHAR(100)
		, banner : ColumnType.CHAR(100)
		, type : ColumnType.CHAR(1, 'U')
		, createdAt : ColumnType.createAt
	}
};

class BasicClient  extends Client
{

    constructor(clientOptions){
        super(clientOptions);
		const _this = this;

        const dbFile = path.resolve(process.cwd(),clientOptions.dbDir || "djsCli.db");
        const db = new Sequelize({
            dialect: 'sqlite',
            storage: dbFile,
			logging: false
        });
		
        db.sql = function(type, query, ...replacements){
            type = type.toUpperCase();
			const startTime = new Date();
            return db.query(`${query}`, { 
				type: QueryTypes[type], 
				replacements, logging : (query)=> {
					_this.logger.info("// == sql", type);
					_this.logger.info(query)
				},
			}).then(out => {
				if(clientOptions.isDBQuery)
					_this.insertLog('02','SQL_LOG',`${Date.now() - startTime.getTime()}ms] ${query}`)
				return out;
			});
        };

		this._db = db;

        // init(db);
		const t_interface = _this.Table;
		t_interface.getTables().then(ts => {
			const tmp_tables = Object.keys(tables).filter(t => !ts.includes(t));
			for (const table of tmp_tables){ 
				t_interface.createTable(table, tables[table]).then(() =>{
					console.log("테이블 생성 -", table);
				}).catch(console.error);
			}
		}).catch(_this.logger.error);

		// updateCode( path.join(__dirname, 'DBBase'))
		// 	.forEach((value, key)=>
		// 		_this[key] = (...args)=>
		// 			value.call(_client, ...args)
		// 	);

		/////////////////////////////////////////////////////////////////////////////////////////////
		
		this.on("guildCreate", _this.updateGuildQuery);
		this.on("guildDelete", _this.updateGuildQuery);

		/////////////////////////////////////////////////////////////////////////////////////////////

		this.on("channelCreate",_this.updateChannelQuery);
		this.on("channelDelete", _this.updateChannelQuery);
		this.on("channelUpdate", (oldChannel, newChannel) =>_this.updateChannelQuery(newChannel));
		/////////////////////////////////////////////////////////////////////////////////////////////
		this.once("ready", _ =>{
			_this.insertLog('00','SERVER_LOG',`Starting discord service.... ${new Date()}\nLogged in as ${_this.user?.tag}!`);
		});

		this.on('error', function(error) { 
			_this.insertLog('02','ERROR_LOG',`${error.name} ${error.stack}`);
		});

		if(clientOptions.dbDebugLog) // 디버깅 로그 활성화인 경우에만
			this.on('debug', function(info) { 
				_this.insertLog('01','DEBUG_LOG',info);
			});
		
    }

	updateGuildQuery({id, name, ownerId}){
		this._db.sql("UPSERT", 
			"INSERT OR REPLACE INTO Guild (id, name, ownerId, isDeleted) VALUES (?, ?, ?, ?)", 
			id, name, ownerId, 'N'
		).catch(_this.logger.error);
	}
	updateChannelQuery({id, name, type, guild, parentId}){
		
		this._db.sql("UPSERT", 
			`INSERT OR REPLACE INTO Channel (id, name, "type", isDeleted, guild_id, parentId, editAt) VALUES (?, ?, ?, 'N',?, ?, CURRENT_TIMESTAMP)`, 
			id, name, type, guild?.id || "public", parentId
		).catch(_this.logger.error);
	}

	// 서버 로그에 추가
	insertLog(type, owner, msg) {
		this._db.query(`INSERT INTO ServerLog (owner, msg, "type") VALUES (?, ?, ?)`, {
			type: QueryTypes.INSERT, 
			replacements : [owner, msg, type]
		});
	}

	/////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * User
	 */
	set User({
		accentColor, id, tag, username, avatar, banner, bot
	}){
		this.Query("UPSERT",
			`INSERT OR REPLACE INTO "User" (id, accentColor, tag, username, avatar, banner, bot) VALUES(?, ?, ?, ?, ?, ?, ?);`,
			id, accentColor, tag, username, avatar, banner, bot ? 'Y' : 'N'
		).catch(this.logger.error);
	}
	
	getUser({id}){
		return this.Query.SELECT(`SELECT * FROM "User" WHERE "id" = ? LIMIT 1`, id).then(([user])=> user);
	}	
	/////////////////////////////////////////////////////////////////////////////////////////////

    get Query(){
        const { sql } = this._db;
        sql.SELECT = (query, ...replacements) => sql("SELECT", query, ...replacements);
        sql.UPDATE = (query, ...replacements) => sql("UPDATE", query, ...replacements);
        sql.INSERT = (query, ...replacements) => sql("INSERT", query, ...replacements);
        sql.DELETE = (query, ...replacements) => sql("DELETE", query, ...replacements);
        return sql;
    }

	get Table(){
		const dbInterface = this._db.getQueryInterface();
		const { addColumn, changeColumn } = dbInterface;

		const column = (type, length = 10) =>{
			// DataTypes.CHAR / DataTypes.DATE / DataTypes.TEXT / DataTypes.INTEGER
			let DBtype = DataTypes[type.toUpperCase()];
			if (typeof DBtype === "function")
				DBtype = DBtype(length);
			return DBtype;
		}

		const out = {
			addColumn : (table, key, type, options = {}) => {
				return addColumn.call(dbInterface, table, key, {
					...options,
					type : column(type, options.typeSize),
				});
			},changeColumn : (table, key, type, options = {}) => {
				return changeColumn.call(dbInterface, table, key, {
					...options,
					type : column(type, options.typeSize),
				});
			},getColumns : (table) => dbInterface.describeTable(table),
			getTables : () =>	dbInterface.showAllSchemas().then(tables => tables.map(({name}) => name)),
		};
		for (const name of ["createTable","dropTable","renameTable","tableExists","describeTable","removeColumn","renameColumn","addIndex","removeIndex"]){
			out[name] = (...args)=> 
				dbInterface[name].call(dbInterface, ...args);
		}

		return out;
	}

}

module.exports = BasicClient;