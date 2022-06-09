'use strict';
const { LoadCommands }= require("@patrickmonster/discord_cli");

const path = require("path");
const name = path.basename(__filename,".js");

// Tip : LoadCommands는 파일명을 기반으로 적용 하시는게 좋습니다.
/**
 * 커맨드 타입
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types 
 * 
 * 대부분 슬레시커맨드 보다는 application command 가 적기 때문에(글로벌 5 + 5 = 10개)
 * Command 디렉토리와 AppCommand 디렉토리로 분활 하시면 관리가 편합니다.
 */

/**
 * 
 * @param { String } name 이름
 * @param { String } description 설명
 * @param { String } type [ CHAT_INPUT, USER, MESSAGE ] 메세지 타입
 * @param { String } channelTypes [GUILD_TEXT, DM] 채널 타입
 * @param { boolean } defaultPermission 앱이 길드에 추가될때 기본적으로 활성화 되는지 여부
 */
module.exports = {
	name,
	type : 1, // [chat input : 1, user : 2, message : 3] - 해당 커맨드 입력 방식입니다. 
	default_permission : true, //
	description : `${name} 관련 옵션입니다`,
	...LoadCommands(path.join(__dirname, name))
};