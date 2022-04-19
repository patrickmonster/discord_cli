'use strict';
const Sequelize = require('sequelize');
const path = require("path");
const config = require( path.join(process.cwd(), "package.json"));
const models = require('./init-models');
const db = {};

let sequelize;
if(!config || !config.database){ // DB옵션 확인
	console.log("SQL]", "올바르지 않은 데이터베이스 셋팅 입니다.");
	process.exit(1);
}

const { database } = config;
/**
 * 시퀄라이저 DB 연결
 */
sequelize = new Sequelize(
	database.database,
	database.username,
	database.password,
	database,
);

const tables = models(sequelize);
/**
 * ORM 모델링
 */
Object.keys(tables).forEach((modelName) => {
	db[modelName] = tables[modelName];
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Sequelize.Op;

const quers = ['SELECT','INSERT','UPDATE',/*'BULKUPDATE','BULKDELETE',*/'DELETE','UPSERT','VERSION','SHOWTABLES','SHOWINDEXES','DESCRIBE','RAW','FOREIGNKEYS'];
for(const key of quers){
	/**
	 * 쿼리
	 * @param {String} query 
	 * @param  {...Object} replacements 
	 * @returns {Promise<Object>}
	 */
	module[key] = (query, ...replacements)=>sequelize.query(query, { type: Sequelize.QueryTypes[key] , replacements });
}

module.exports = db;