'use strict';
const DBClient = require('./DBClient');
const { GuildMember } = require('discord.js');

const ColumnType = require("./Util/DBColumn")
// ----------------------------------------------------------------
// 업적 - 리더보드형
const tables = {
	Achievements : [
		{ // 업적
			id : ColumnType.idx
			,name : ColumnType.CHAR(100) // 업적이름
			,description : ColumnType.CHAR(1000) // 업적이름
			,type : ColumnType.CHAR(20) // 업적 타입
			,EventType : ColumnType.CHAR(50) // 업적 이벤트
			,EventCount : { ...ColumnType.INTEGER, defaultValue : 1 } // 업적 횟수(요건 만족 회수)
			,createAt : ColumnType.createAt
			,isDeleted : ColumnType.Bool
			,parentId : ColumnType.Snowflake
		},
	],
	AchievementsData : [
		{ // 업적 기록 - 클리어 기록
			id : ColumnType.id
			,eventID : ColumnType.INTEGER
			,guild : ColumnType.Snowflake
			,createAt : ColumnType.createAt
			,isDeleted : ColumnType.Bool
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
 * 
 * event
 *  - achievementCreate(user : User | GuildMember ) // 사용자가 신규 업적을 달성함
 *  - 
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
		this.achievementUpdate(user, achievement_id, false);
	}
	achievementCreate(user, achievement_id) { 
		this.achievementUpdate(user, achievement_id, false);
	}

	achievementDelete(user, achievement_id) {
		this.achievementUpdate(user, achievement_id, true);
	}
	
	// 리더보드 사용자 업적 업데이트
	achievementUpdate(user, achievement_id, isDeleted = false) {
		const _this = this;
		const params = [user.id, achievement_id, (typeof isDeleted === 'boolean' ? (isDeleted ? 'Y' : 'N') : isDeleted || 'N') ];
		if( user instanceof GuildMember){	
			params.push(user.guild?.id);
		}

		_this.Query.SELECT(`SELECT * FROM AchievementsData WHERE id = ? AND eventID = ? ${user instanceof GuildMember ? 'AND guild = ?' : ''}`, ...params).then(([isAchievement])=>{
			
			if(isDeleted && isAchievement){ // 삭제0 = 존재0
				return _this.Query.DELETE(`DELETE FROM AchievementsData WHERE id = ? AND eventID = ?`, ...params).then(_=>{
					_this.emit("achievementDelete", user, achievement_id);  // 업적이 없음
				});
			}

			if(!isDeleted && !isAchievement){ // 삭제x = 존재x
				return _this.Query.INSERT(`INSERT INTO "AchievementsData" (id, eventID, isDeleted${user instanceof GuildMember ? ', guild' : ''}) VALUES(?, ?, ?${user instanceof GuildMember ? ', ?' : ''});`,...params).then(_=>{
					_this.emit("achievementCreate", user, achievement_id);  // 업적이 없음
				});
			}

			return {};
		}).catch(this.logger.error);
	}

	// 업적 리스트를 가져 옵니다.
	get achievement(){
		const _this = this;
		return _this.Query.SELECT(`SELECT * FROM Achievements WHERE isDeleted = 'N'`).catch(_this.logger.error);
	}

	// 업적을 조회합니다
	getAchievement(id){
		const _this = this;
		return _this.Query.SELECT(`SELECT * FROM Achievements WHERE isDeleted = 'N' AND id = ?`, id).catch(_this.logger.error);
	}


	// 업적을 추가합니다.
	set achievements(achiev = {}){
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
		}else {
			_this.Query.INSERT( 
				`INSERT INTO Achievements (name, description, type, EventType, EventCount, isDeleted, parentId) VALUES(?, ?, ?, ?, ?, ?, ?);`,
				name, description || '-', type || '-', EventType || '-', EventCount || 1, typeof isDeleted == "boolean" ? (isDeleted ? 'N' : 'Y') : (isDeleted || 'N'), parentId || null
			).catch(_this.logger.error);
		}
		
	}

	// 사용자의 모든 업적을 가져 옵니다.
	getAchievements(user) { 
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