'use strict';
const { Interaction } = require('discord.js') // 추가 라이브러리
/**
* interactionCreate.js - 클라이언트 이벤트
*  create Thu Jun 09 2022 11:05:12 GMT+0900 (대한민국 표준시)
 * @param { Interaction }  interaction 
* @returns 
*/
module.exports = function interactionCreate( interaction ) {	
    if(interaction.user.bot)return; // 봇은 검사 하지 않음
    switch(interaction.targetType){
        case "USER" : // 유저 앱 명령
        case "MESSAGE": // 메세지 앱 명령
        case "CHAT_INPUT": // 메세지 커맨드 
            const cmd = this.eventButton.get(interaction.commandName);
            if(cmd) cmd(interaction, ...args);
            break;
        default: // 버튼 및 매뉴 이벤트
            if(interaction.isButton()){
				const [commend, ...args] = interaction.customId.split(' ');
				const cmd = this.eventButton.get(commend);
				if(cmd) cmd(interaction, ...args);
			}
            if(interaction.isCommand()) {
				const cmd = this.eventCommand.get(interaction.commandName);
				if(cmd) cmd(interaction, interaction.options.getSubcommand(false));
            }
            if(interaction.isSelectMenu()){;}
            if(interaction.isModalSubmit()) {;}
    }
}