'use strict';
const Client = require('./Client')

const fs = require('fs');
const path = require("path");
const Sequelize = require('sequelize');

/* ============================================================================================ */
const dbs = [`
-- Channel definition
CREATE TABLE Channel (
	id varchar(20),
	name varchar(100),
	"type" varchar(20),
	createAt TIMESTAMP(26),
	isDeleted varchar(1),
	guild_id varchar(20),
	parentId varchar(20),
	editAt TIMESTAMP(26)
);`,`
-- Guild definition
CREATE TABLE Guild (
	id varchar(20),
	isDeleted varchar(1),
	ownerId varchar(20),
	joinedTimestamp TIMESTAMP(26),
	name varchar(100)
);
-- GuildLog definition
CREATE TABLE GuildLog (
	timeAt TIMESTAMP(26) NOT NULL,
	owner varchar(20),
	msg text(65535),
	"type" varchar(2)
);
-- "Role" definition
CREATE TABLE "Role" (
	id varchar(20),
	guild_id varchar(20),
	createAt TIMESTAMP(26),
	name varchar(100),
	"position" int,
	isDeleted varchar(1)
);
-- ServerLog definition
CREATE TABLE ServerLog (
	timeAt TIMESTAMP(26) NOT NULL,
	owner varchar(20),
	msg text(65535),
	"type" varchar(2)
);
-- "User" definition
CREATE TABLE "User" (
	id varchar(20),
	accentColor int,
	avatar varchar(100),
	banner varchar(100),
	createdAt TIMESTAMP(26),
	createdTimestamp int,
	tag varchar(200),
	username varchar(100),
	insertAt TIMESTAMP(26) NOT NULL
);
`]// 디비를 초기화 합니다


function init(db){
}

class BasicClient extends Client {

    constructor(clientOptions){
        super(clientOptions);
        const dbFile = path.resolve(process.cwd(),clientOptions.dbDir || "djsCli.db");

        this._db = new Sequelize({
            dialect: 'sqlite',
            storage: dbFile
        });
        
    }

    sql(type, query, ...replacements){
        type = type.toUpperCase();
        return this._db.query(`${query}`, { type: Sequelize.QueryTypes[type], replacements });
    }
    
    Select(query, ...replacements){
        return this.sql("SELECT", query, ...replacements)
    }

    Update(query, ...replacements){
        return this.sql("UPDATE", query, ...replacements)
    }

    Insert(query, ...replacements){
        return this.sql("INSERT", query, ...replacements)
    }

    Delete(query, ...replacements){
        return this.sql("DELETE", query, ...replacements)
    }

}

module.exports = BasicClient;