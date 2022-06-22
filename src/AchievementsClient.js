'use strict';
const DBClient = require('./DBClient');
const { GuildMember } = require('discord.js');
const { Sequelize, DataTypes, QueryTypes } = require('sequelize');

// ----------------------------------------------------------------
// 업적 - 리더보드형
const tables = {
	Achievements : [
		{ // 업적
			id : { // 고유 ID
				type : DataTypes.INTEGER,
				primaryKey : true,
				autoIncrement : true,
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
	],
	AchievementsData : [
		{ // 업적 기록 - 클리어 기록
			id : { // 고유 사용자
				type : DataTypes.CHAR(20),
				unique : "achievementsKey",
				allowNull : false
			}
			,eventID : {
				type : DataTypes.INTEGER,
				allowNull : false,
				unique : "achievementsKey",
			}
			,guild : { // 고유 사용자
				type : DataTypes.CHAR(20),
				defaultValue : 'public', // 공개
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
		},
		{
			uniqueKeys: {
				achievementsKey: {
					fields: ['id', 'eventID']
				}
			}
		}
	],
}
/**
 * 업적 클라이언트
 *  - 사용자 업적을 관제함
 */
class AchievementsClient extends DBClient {
    constructor(options) {
        super(options);
		const _this = this;

		this.once("ready", () =>{ // 규칙에 필요한 테이블 생성
			const t_interface = _this.Table;
			t_interface.getTables().then(ts =>{
				const tmp_tables = Object.keys(tables).filter(t => !ts.includes(t));
				for (const table of tmp_tables){ 
					const [tableObject, keys] = tables[table];
					t_interface.createTable(table, tableObject, keys).then(() =>{
						console.log("테이블 생성 -", table);
					}).catch(console.error);
				}
			}).catch(_this.logger.error);
		})
    }


	// 업적 완료 이벤트 - 사용자가 업적을 완료 할 경우
	achievementComplete(user, achievement_id) { 
		return this.achievementUpdate(user, achievement_id, false);
	}
	achievementCreate(user, achievement_id) { 
		return this.achievementUpdate(user, achievement_id, false);
	}

	achievementDelete(user, achievement_id) {
		return this.achievementUpdate(user, achievement_id, true);
	}
	
	// 리더보드 사용자 업적 업데이트
	achievementUpdate(user, achievement_id, isDeleted = false) {
		const _this = this;
		const params = [user.id, achievement_id, (typeof isDeleted === 'boolean' ? (isDeleted ? 'Y' : 'N') : isDeleted || 'N') ];
		if( user instanceof GuildMember){
			params.push(user.guild?.id);
		}
		return this.Query("UPSERT",
			`INSERT OR REPLACE INTO "AchievementsData" (id, eventID, isDeleted${user instanceof GuildMember ? ', guild' : ''}) VALUES(?, ?, ?${user instanceof GuildMember ? ', ?' : ''});`,
			...params
			 ).then(([_, isCreate])=>{
			console.log(_, isCreate);
			if( isCreate ) // 업적 완료 이벤트
				_this.emit("AchievementDelete", user, achievement_id,);
		}).catch(this.logger.error);
	}

	// 업적 리스트를 가져 옵니다.
	get achievement(){
		const _this = this;
		return _this.Query.SELECT(`SELECT * FROM Achievements WHERE isDeleted = 'N'`).catch(_this.logger.error);
	}


	// 업적을 추가합니다.
	set achievement(achiev = {}){
		const _this = this;
		
		if( !achiev.name ){
			throw new Error("업적의 이름은 필수값입니다. { name }");
		}

		const {
			id, name, description, type, EventType, EventCount, isDeleted, parentId
		} = achiev;

		console.log(achiev);
		if( id ){
			_this.Query("UPSERT",
				`INSERT OR REPLACE INTO Achievements (id, name, description, type, EventType, EventCount, isDeleted, parentId) VALUES(?, ?, ?, ?, ?, ?, ?, ?);`,
				id, name, description || '-', type || '-',
				EventType || '-', EventCount || 1, typeof isDeleted == "boolean" ? (isDeleted ? 'N' : 'Y') : (isDeleted || 'N'), parentId || null
			).catch(_this.logger.error);
			// INSERT INTO Achievements (id, name, description, type, EventType, EventCount, createAt, isDeleted, parentId)
		}else {
			_this.Query.INSERT( 
				`INSERT INTO Achievements (name, description, type, EventType, EventCount, isDeleted, parentId) VALUES(?, ?, ?, ?, ?, ?, ?);`,
				name, description || '-', type || '-', EventType || '-', EventCount || 1, typeof isDeleted == "boolean" ? (isDeleted ? 'N' : 'Y') : (isDeleted || 'N'), parentId || null
			).catch(_this.logger.error);
		}
		
	}

	// 사용자의 모든 업적을 가져 옵니다.
	getAchievement(user) { 
		const _this = this;
		const params = [user.id]
		if( user instanceof GuildMember){
			params.push(user.guild?.id);
		}
		return _this.Query.SELECT(`
SELECT 
	ad.id
	, a.id AS eventID
	, ad.createAt
	, a.name
	, a.description
	, a.type
	, a.EventType
	, a.EventCount
	, a.parentId
	 -- , a.createAt AS 
FROM Achievements a
LEFT JOIN (
	SELECT  *
	FROM AchievementsData
	WHERE id = ?
	AND isDeleted = 'N'
) ad
ON a.id = ad.eventID
WHERE 1=1
AND a.isDeleted = 'N'
${user instanceof GuildMember ? "AND ad.guild = ?" : ""}
		`, ...params).catch(_this.logger.error);
	}

	// 사용자의 모든 업적을 리더보드로 나타 냅니다.
	getReaderBord(user){
		const _this = this;
		return this.getAchievement(user).then(comp => {
			const comp_count = comp.filter(({id})=> id).length;
			return {
				total : comp.length,
				complet : comp_count,
				percent : (comp_count / comp.length * 100).toFixed(2),
				achievement : comp
			};
		}).catch(_this.logger.error);
	}
}


module.exports = AchievementsClient;