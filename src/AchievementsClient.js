'use strict';
const DBClient = require('./DBClient');
const { Sequelize, DataTypes, QueryTypes } = require('sequelize');

const tables = {
	Achievements : { // 업적
		id : { // 고유 ID
			type : DataTypes.INTEGER,
			primaryKey : true,
			allowNull : false
		}
		,name : DataTypes.CHAR(100) // 업적이름
		,description : DataTypes.CHAR(1000) // 업적이름
		,type : DataTypes.CHAR(20) // 업적 타입
		,EventType : DataTypes.CHAR(50) // 업적 이벤트
		,EventCount : {  // 업적 횟수(요건 만족 회수)
			type : DataTypes.INTEGER,
			defaultValue : 1,
			allowNull : false
		}
		,createAt : { // 업적 제작일
			type : DataTypes.DATE,
			defaultValue : Sequelize.literal('CURRENT_TIMESTAMP'),
			allowNull : false
		}
		,isDeleted : { // 삭제여부
			type : DataTypes.CHAR(1),
			defaultValue : 'N',
			allowNull : false
		}
		,parentId : DataTypes.CHAR(20) // 선행 업적
	},
	AchievementsData : { // 업적 기록 - 클리어 기록
		id : { // 고유 사용자
			type : DataTypes.INTEGER,
			primaryKey : true,
			allowNull : false
		}
		,eventID : DataTypes.INTEGER // 업적 인덱스
		,createAt : { // 업적 제작일
			type : DataTypes.DATE,
			defaultValue : Sequelize.literal('CURRENT_TIMESTAMP'),
			allowNull : false
		}
		,isDeleted : { // 삭제여부
			type : DataTypes.CHAR(1),
			defaultValue : 'N',
			allowNull : false
		}
	},
}
/**
 * 업적 클라이언트
 *  - 사용자 업적을 관제함
 */
class AchievementsClient extends DBClient {
    constructor(options) {
        super(options);
		const _this = this;
        // this.on("interactionCreate", _this.onInteractionCreate);

		this.one("ready", () =>{ // 규칙에 필요한 테이블 생성
			const t_interface = _this.Table;
			t_interface.getTables().then(ts =>{
				const tmp_tables = Object.keys(tables).filter(t => !ts.includes(t));
				for (const table of tmp_tables){ 
					t_interface.createTable(table, tables[table]).then(() =>{
						console.log("테이블 생성 -", table);
					}).catch(console.error);
				}
			}).catch(_this.logger.error);
		})
    }


	// 업적 완료 이벤트 - 사용자가 업적을 완료 할 경우
	achievementComplete({id}, achievement_id) { 
		
	}


	// 업적 리스트를 가져 옵니다.
	get achievement(){
		return this.Query.SELECT(`SELECT * FROM Achievements WHERE isDeleted = 'N'`).catch(_this.logger.error);
	}

	// 사용자가 진행한 모든 업적을 가져 옵니다.
	getAchievement(id) { 
		return this.Query.SELECT(`
SELECT 
	ad.id
	, ad.eventID
	, ad.createdAt
	, a.name
	, a.description
	, a.type
	, a.EventType
	, a.EventCount
	, a.createAt
FROM Achievements a 
LEFT JOIN AchievementsData ad
ON a.id = ad.eventID
WHERE 1=1
AND a.isDeleted = 'N'
AND ad.isDeleted = 'N'
		`).catch(_this.logger.error);
	}

    // TODO:
    getTableColumns(options){

    }
}


module.exports = AchievementsClient;