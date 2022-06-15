'use strict';
const DBClient = require('./DBClient')

const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
/**
 * 에디터 클라이언트
 *  - DB 설정을 변경 및 수정함
 */
class Client extends DBClient {
    constructor(options) {
        super(options);

        this.on("interactionCreate", this.onInteractionCreate);
    }

    // 인터렉션 이벤트
    onInteractionCreate(interaction){
        const _this = this;
        if(interaction.customId.startsWith("DBClient")){
            if(interaction.user.bot)return; // 봇은 검사 하지 않음
            _this.getUser(interaction.user.id).then(user =>{
                
            });
            return;
        }
        this.emit("interactionCreateEditer", interaction);
    }
	// 테이블 정보를 출력합니다.
	// getTableComponent({}, {}) or getTableComponent({}, "");
	getTableComponent(menuOptions, itemOptions){
		const _this = this;
		if(typeof itemOptions  === "string"){
			_this.Table.getColumns(tableName).then(columns =>{
				_this.getMenu({
					...menuOptions,
					maxValues: 1, minValues: 1 
				}, Object.keys(columns).map(name=>{
					const {type, allowNull, defaultValue, primaryKey, unique} = columns[name];
					return {
						label : `${name}`,
						description : `${type} ${defaultValue || "기본값 없음"} (${allowNull ? "Null" : "Not null"})`,
						value : `${name}`,
						emoji: { name: primaryKey ? '🆔' : ( unique ? '❗' : '🔵') },
					}
				}))
			})
		}else{
			return _this.Query("SHOWTABLES", "SELECT * FROM sqlite_master WHERE type='table';").then(tNames=>
				_this.getMenu(menuOptions, tNames.map(name => ({
					default : flse,
					description : ``,
					label : `${name}`,
					... itemOptions,
					value : `${name}`
				})))
			)
		}
	}

    // TODO:
    getTableColumns(options){

    }
}


module.exports = Client;