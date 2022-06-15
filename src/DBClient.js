'use strict';
const Client = require('./Client')

const fs = require('fs');
const path = require("path");

// const updateCode = require("./Util/updateCode");

const { Sequelize, DataTypes, QueryTypes } = require('sequelize');
// Sequelize.DATA
/* ============================================================================================ */
const tables = {
	Channel : {
		id : {
			type : DataTypes.CHAR(20),
			primaryKey : true,
			allowNull : false
		}
		,name : DataTypes.CHAR(100)
		,type : DataTypes.CHAR(20)
		,createAt : DataTypes.DATE
		,isDeleted : {
			type : DataTypes.CHAR(1),
			defaultValue : 'N',
			allowNull : false
		}
		,guild_id :  {
			type : DataTypes.CHAR(20),
			defaultValue : 'DM',
			allowNull : false
		}
		,parentId : DataTypes.CHAR(20)
		,editAt : {
			type : DataTypes.DATE,
			defaultValue : Sequelize.literal('CURRENT_TIMESTAMP'),
			allowNull : false
		}
	},
	Cache : {
		key : {
			type : DataTypes.CHAR(100),
			primaryKey : true,
			allowNull : false
		},
		value : {
			type : DataTypes.TEXT
		},
	},
	Guild : {
		id : {
			type : DataTypes.CHAR(20),
			primaryKey : true,
			allowNull : false
		}
		,name : DataTypes.CHAR(100)
		,ownerId : DataTypes.CHAR(20)
		,joinedTimestamp : {
			type : DataTypes.DATE,
			defaultValue : Sequelize.literal('CURRENT_TIMESTAMP'),
			allowNull : false
		}
		,isDeleted : {
			type : DataTypes.CHAR(1),
			defaultValue : 'N',
			allowNull : false
		}
	},
	ServerLog : {
		timeAt : {
			type : DataTypes.DATE,
			defaultValue : Sequelize.literal('CURRENT_TIMESTAMP'),
			allowNull : false
		}
		,owner : DataTypes.CHAR(20)
		,msg : DataTypes.TEXT(65535)
		,type : DataTypes.CHAR(2)
	},
	User : {
		id : {
			type : DataTypes.CHAR(20),
			primaryKey : true,
			allowNull : false
		},
		bot : {
			type : DataTypes.CHAR(1),
			defaultValue : 'N',
			allowNull : false
		}
		,accentColor : DataTypes.INTEGER
		,tag : DataTypes.CHAR(200)
		,username : DataTypes.CHAR(100)
		,avatar : DataTypes.CHAR(100)
		,banner : DataTypes.CHAR(100)
		,type : {
			type : DataTypes.CHAR(1),// 사용자정보 - 관리 혹은 지정 상태
			defaultValue : 'U',
			allowNull : false
		}
		,createdAt :{
			type : DataTypes.DATE,
			defaultValue : Sequelize.literal('CURRENT_TIMESTAMP'),
			allowNull : false
		}
	}
};

function init(db){
    db.sql("SHOWTABLES", "SELECT * FROM sqlite_master WHERE type='table';").then(tableNames=>{
		const dbInterface = db.getQueryInterface();

 		const tmp_talbes = Object.keys(tables).filter(name => !tableNames.includes(name));
		for (const table of tmp_talbes){ 
			dbInterface.createTable(table, tables[table]).then(() =>{
				console.log("테이블 생성 -", table);
			}).catch(console.error);
		}
    }).catch(console.error);
}

class BasicClient 
	extends Client
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
				replacements, logging : _this.logger.info
			}).then(out => {
				if(clientOptions.isDBQuery)
					insertLog('02','SQL_LOG',`${Date.now().getTime() - startTime.getTime()}ms ${query} ${JSON.stringify(replacements)}`)
				return out;
			});
        };

		this._db = db;

        init(db);

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
			insertLog('00','SERVER_LOG',`Starting discord service.... ${new Date()}\nLogged in as ${_this.user.tag}!`);
		});

		this.on('error', function(error) { 
			insertLog('02','ERROR_LOG',`${error.name} ${error.stack}`);
		});

		if(clientOptions.dbDebugLog) // 디버깅 로그 활성화인 경우에만
			this.on('debug', function(info) { 
				insertLog('01','DEBUG_LOG',info);
			});
		
    }
	/*
	get logger (){
		return {
			error : console.error
		}
	}
	on(){}
	once(){} */

	updateGuildQuery({id, name, ownerId}){
		this._db.sql("UPSERT", 
			"INSERT OR REPLACE INTO Guild (id, name, ownerId, isDeleted) VALUES (?, ?, ?, ?)", 
			id, name, ownerId, 'N'
		).catch(_this.logger.error);
	}
	updateChannelQuery({id, name, type, guildId :  guild_id, parentId}){
		this._db.sql("UPSERT", 
			`INSERT OR REPLACE INTO Channel (id, name, "type", isDeleted, guild_id, parentId, editAt) VALUES (?, ?, ?, 'N',?, ?, CURRENT_TIMESTAMP)`, 
			id, name, type, guild_id, parentId
		).catch(_this.logger.error);
	}

	// 서버 로그에 추가
	insertLog(type, owner, msg) {
		this._db.sql("INSERT", 
			`INSERT INTO ServerLog (owner, msg, "type") VALUES (?, ?, ?)`, 
			owner, msg, type
		).catch(this.logger.error);
	}

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
	
	async getUser(id){
		return await this.Query.SELECT(`SELECT * FROM "User" WHERE "id" = ? LIMIT 1`, id).then(([user])=> user);
	}

	set Data({
		key, value
	}){

	}

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
		};
		for (const name of ["createTable","dropTable","renameTable","tableExists","describeTable","removeColumn","renameColumn","addIndex","removeIndex"]){
			out[name] = (...args)=> 
				dbInterface[name].call(dbInterface, ...args);
		}

		return out;
	}

}

module.exports = BasicClient;