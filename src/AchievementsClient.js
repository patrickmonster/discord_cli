'use strict';
const DBClient = require('./DBClient');
const { GuildMember } = require('discord.js');

const ColumnType = require("./Util/DBColumn")
// ----------------------------------------------------------------
// 업적 - 리더보드형
const tables = {

	/// 사용자 포인트 관련
	UserPoint : [ // 사용자 포인트
		{ // 업적
			id : ColumnType.id
			,point : ColumnType.INTEGER(0) // 포인트
			,createAt : ColumnType.createAt // 
		},
	],
	UserPointLog : [ // 사용자 포인트 로그
		{ // 업적
			id : ColumnType.idx
			, user : ColumnType.Snowflake // 유저
			,description : ColumnType.CHAR(1000) // 설명
			,isDeleted : ColumnType.Bool() // 취소여부
			,createAt : ColumnType.createAt
			,point : ColumnType.INTEGER(0) // 지급된 포인트
		},
	],

	/// 업적관련
	Achievements : [
		{ // 업적
			id : ColumnType.idx
			,name : ColumnType.CHAR(100) // 업적이름
			,description : ColumnType.CHAR(1000) // 업적이름
			,type : ColumnType.CHAR(20) // 업적 타입
			,EventType : ColumnType.CHAR(50) // 업적 이벤트
			,EventCount : ColumnType.INTEGER(1) // 업적 횟수(요건 만족 회수)
			,createAt : ColumnType.createAt
			,isGuild : ColumnType.Bool() // 길드 여부 - 각각의 길드에서 별도로 처리하는지 여부
			,isDeleted : ColumnType.Bool()
			,parentId : ColumnType.Snowflake
		},
	],
	AchievementsData : [
		{ // 업적 기록 - 클리어 기록
			id : ColumnType.id
			,eventID : ColumnType.INTEGER(1)
			,guild : ColumnType.Snowflake
			,createAt : ColumnType.createAt
			,isDeleted : ColumnType.Bool()
		},
		{
			uniqueKeys: {
				achievementsKey: {
					fields: ['id', 'eventID']
				}
			}
		}
	],
	AchievementsStatus: [
		{// 업적 진행도
			id : ColumnType.id // 소유주
			,EventType : ColumnType.CHAR(50) // 업적 이벤트
			,count : ColumnType.INTEGER() // 진행 횟수
			,guild : ColumnType.Snowflake
			// 
		},
		{
			uniqueKeys: {
				achievementsStatusKey: {
					fields: ['id', 'EventType', "guild"]
				}
			},
			fields : [ "guild", "EventType" ],
		}
	]
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

		// this.once("ready", () =>{ // 규칙에 필요한 테이블 생성
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
		// })
    }


	// 내부 - 연산시 상태값이 이벤트 요건을 충족하는지 확인 합니다.
	// TODO : 값 삽입 - 모든 업데이트
	#achievementStateValue(user){
		const _this = this;
		_this.Query.SELECT(`
WITH ach AS ( -- 사용자의 진행도
	SELECT * FROM AchievementsData 
	WHERE id = ? AND isDeleted = 'N'
)
SELECT (SELECT EXISTS(SELECT * FROM ach WHERE eventID = a.id)) AS comp -- 성공유무
	, CASE WHEN (a.EventCount <= b.count)THEN TRUE ELSE FALSE END AS success 
	, a.id , a.name, a.description, a."type", a.EventType, a.EventCount, a.createAt, a.parentId, a.isGuild
FROM Achievements a
LEFT JOIN (
	SELECT * FROM AchievementsStatus WHERE id = ?
) b
ON b.EventType = a.EventType 
WHERE 1=1
AND comp != 1 -- 이미성공했는지 여부
AND success = 1 -- 신규로 성공 했는가
		`, user.id, user.id).then(achievements => {
			_this.Query.INSERT(` INSERT INTO AchievementsData (id, eventID, guild, isDeleted) VALUES('', 1, '', 'N'); `)	
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

	// 사용자 업적 상태를 불러옴
	achievementState(user, eventType){
		const _this = this;
		const { id, guild} = user;

		return _this.Query.SELECT(`
SELECT 
	id
	, EventType
	, count
	, guild
FROM AchievementsStatus
WHERE id = ?
AND guild = ?
AND EventType = ?
		`, id, guild?.id || null, eventType)
	}

	achievementStateAppend(user, eventType, count) {
		const _this = this;
		const { id, guild} = user;

		_this.Query.UPDATE(
			`UPDATE AchievementsStatus SET count = AchievementsStatus.count + ? WHERE id = ?  AND EventType = ? AND guild${guild ? " = ?" : ' IS NULL -- ?' }`,
			count, id, eventType, guild?.id || null, 
		).then(([, isUpdate]) =>{
			if(!isUpdate)
				return _this.Query.INSERT(`INSERT INTO AchievementsStatus (id, EventType, count, guild) VALUES(?, ?, ?, ?);`, id, eventType, count, guild?.id || null, )
		}).catch(_this.logger.error);

		
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

	/////////////////////////////////////////////////////////////////

	// 포인트 랭킹 조회 - 상위 50명
	get Point(){
		const _this = this;
		return _this.Query.SELECT(`
SELECT * 
FROM UserPoint
WHERE 1=1
LIMIT 50
ORDER BY point DESC
		`).catch(_this.logger.error);
	}

	// 사용자 포인트를 가신/감산 합니다
	set Point({
		id, point, description
	}){
		const _this = this;
		_this.Query.INSERT(`
INSERT INTO UserPointLog (user, point, description)
VALUES(?, ?, ?);
		`, id, point, description).then(_=>
			_this.Query.UPDATE( `UPDATE UserPoint SET point = UserPoint.point + ? WHERE id = ?`, point, id ).then(([, isUpdate]) =>{
				if(!isUpdate)
					return _this.Query.INSERT(`INSERT INTO UserPoint (id, point) VALUES(?, ?);`, id, point)
			}).catch(_this.logger.error)
		)
	}

	// 사용자 포인트 로그를 조회합니다
	getPointLog(id = 0, idx = 0, size = 100){
		const _this = this;
		return _this.Query.SELECT(`
SELECT *
FROM UserPointLog 
${id ? '-- ' : ''} WHERE id = ?
LIMIT ?, ?
		`, id, idx * size, size).then(out=> out.map(o=> {
			o.isDeleted = o.isDeleted == 'N';
			return o;
		}));
	}

	// 사용자 포인트를 조회합니다
	getPoint(id = 0){
		const _this = this;
		return _this.Query.SELECT(`
SELECT * FROM UserPoint WHERE id = ?
		`, id).then(([user])=> user);
	}

	// 사용자 포인트를 취소합니다. (지급 정보를 롤백합니다)
	set DeletePoint({
		id, idx, description
	}){
		const _this = this;

		if(!id && !idx)
			return _this.logger.error("필수값(id, idx)가 누락되었습니다.");

		// 포인트 로그 조회 및 업데이트
		_this.Query.SELECT(`SELECT point FROM UserPointLog WHERE user = ? AND id = ? AND isDeleted = 'N'`, id, idx).then(([log])=>{
			if(!log)
				return _this.logger.error("포인트 로그 정보가 일치하지 않거나, 없습니다!");
				// throw new Error();
			const { point } = log;
			_this.Point = { id, point : point * -1, description : `${idx}]${description || " -- "}`}; // 포인트 롤백연산
			_this.Query.UPDATE( `UPDATE UserPointLog SET isDeleted = 'Y' WHERE id = ?`, idx  ).catch(_this.logger.error); // 지급이력 비 활성화
		});
	}
}


module.exports = AchievementsClient;