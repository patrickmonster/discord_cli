const getCommands = require('./getCommands'); // 커맨드 관리자

/**
 * 커맨드 관리 모델
 * 사용자 
 * @param { String } path 탐색위치(pull)
 * @param { function } error 찾을수 없을시, 콜백
 * @param { Number } type [
 * 		SUB_COMMAND : 보조명령, SUB_COMMAND_GROUP : 보조명령 그룹
 * 		, STRING : 문자열, INTEGER : 정수, BOOLEAN : 절대값, USER : 사용자, CHANNEL : 채널
 * 		, ROLE : 역할, MENTIONABLE : 사용자 or 역할, NUMBER : 정수]
 */

 function commands(path, done, error){
	console.log(`[커맨드관리자]${path.split(process.env.sep).pop()}`);
	const cmd = getCommands(path);
	const options = [];
	for (const v of cmd.command.values()){
		options.push(v);
	}
	return {
		...cmd, // command, get, update
		options,
		execute : async function(interaction, user, subcommand, ...args){
			const commend = cmd.get(subcommand);
			if (commend) {
				if(done) done(interaction);
				commend.execute(interaction, user, ...args);
			}
			else {
				if(typeof error == "function") error(interaction); 
				else interaction.editReply({ content: error || '명령어를 찾지 못하였습니다.', ephemeral: true });
			}
		}
	};
}
module.exports = commands;