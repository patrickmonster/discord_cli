'use strict';
const Client = require('./Client')

const fs = require('fs');
const path = require("path");
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
	// extends Client
{

    constructor(clientOptions){
        // super(clientOptions);
		const _this = this;

        const dbFile = path.resolve(process.cwd(),clientOptions.dbDir || "djsCli.db");
        const db = new Sequelize({
            dialect: 'sqlite',
            storage: dbFile
        });
		
        db.sql = function(type, query, ...replacements){
            type = type.toUpperCase();
			const startTime = new Date();
            return db.query(`${query}`, { 
				type: QueryTypes[type], 
				replacements, logging : _this.logger.info
			}).then(out => {
				if(clientOptions.isDBQuery)
					db.sql("INSERT", `INSERT INTO ServerLog (owner, msg, "type") VALUES ("SQL_LOG", ?, '02')`, `${Date.now().getTime() - startTime.getTime()}ms ${query} ${JSON.stringify(replacements)}`).catch(_this.logger.error);
				return out;
			});
        };

		this._db = db;

        init(db);


		/////////////////////////////////////////////////////////////////////////////////////////////
		
		function updateGuildQuery({id, name, ownerId}){
			db.sql("UPSERT", 
				"INSERT OR REPLACE INTO Guild (id, name, ownerId, isDeleted) VALUES (?, ?, ?, ?)", 
				id, name, ownerId, 'N'
			).catch(_this.logger.error);
		}
		this.on("guildCreate", updateGuildQuery);
		this.on("guildDelete", updateGuildQuery);

		/////////////////////////////////////////////////////////////////////////////////////////////

		function updateChannelQuery({id, name, type, guildId :  guild_id, parentId}){
			db.sql("UPSERT", 
				`INSERT OR REPLACE INTO Channel (id, name, "type", isDeleted, guild_id, parentId, editAt) VALUES (?, ?, ?, 'N',?, ?, CURRENT_TIMESTAMP)`, 
				id, name, type, guild_id, parentId
			).catch(_this.logger.error);
		}
		this.on("channelCreate",updateChannelQuery);
		this.on("channelDelete", updateChannelQuery);
		this.on("channelUpdate", (oldChannel, newChannel) =>updateChannelQuery(newChannel));
		/////////////////////////////////////////////////////////////////////////////////////////////
		this.once("ready", _ =>{
			db.sql("UPSERT",
				`INSERT OR REPLACE INTO ServerLog (owner, msg, "type") VALUES ("SERVER_LOG", ?, '00')`, 
				`Starting discord service.... ${new Date()}\nLogged in as ${client.user.tag}!`
			).catch(_this.logger.error);
		});

		this.on('debug', function(info) {
			db.sql("INSERT",
				`INSERT INTO ServerLog (owner, msg, "type") VALUES ("SERVER_LOG", ?, '01')`, info.message
			).catch(_this.logger.error);
		});

		
    }


	/// 임시 환경
	on(str, callback) {}
	once(str, callback) {}

	get logger (){
		return {
			info: console.log,
			error: console.error,
		}
	}

	getUser(id){
		return this.Query.SELECT(`SELECT * FROM "User" WHERE "id" = ? LIMIT 1`, id).then(([user])=> user);
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
		).catch(this.error);
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
		const {
			createTable, dropTable, renameTable, tableExists,
			addColumn, removeColumn, changeColumn, renameColumn,
			addIndex, removeIndex
		} = this._db.getQueryInterface();
		return {
			createTable, dropTable, renameTable, tableExists,
			addColumn, removeColumn, changeColumn, renameColumn,
			addIndex, removeIndex	
		};
	}

}

module.exports = BasicClient;