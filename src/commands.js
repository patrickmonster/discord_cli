const { Interaction } = require('discord.js')
const getCommands = require('./Util/getCommands'); // 커맨드 관리자
const { sep } = require('path');
/**

 * 커맨드 관리 모델
	- 라이브러리 리스트를 자동으로 불러옴
 * 사용자 
 * @param { String } path 탐색위치(pull)
 * @param { function } done 이벤트 진행전처리
 * @param { function } error 찾을수 없을시, 콜백
 * @param { Number } type [
 * 		
 */
 function commands(path, done, error){
	console.log(`[커맨드관리자]${path.split(sep).pop()}`);
	const cmd = getCommands(path);
	const options = [];
	for (const v of cmd.command.values())
		options.push(v);
	return {
		...cmd, // command, get
		options,
		execute : async function(event, subcommand, ...args){
			const commend = cmd.get(subcommand);
			if (commend) {
				done && done(event);// 중간처리
				commend.execute(event, ...args);
			}else {
				if (error){
					error(event);
				}else{
					if(Interaction instanceof event){
						event[event.replied ? 'editReply' : 'reply']({ content: error || '명령어를 찾지 못하였습니다.', ephemeral: true });	
					}
				}
			}
		}
	};
}
module.exports = commands;