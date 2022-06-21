const fs = require('fs');
const path = require('path');


const { "djs-cli" : cli } = path.join(process.cwd(), 'package.json');

/**
 * 모듈 캐시 제거 - 파일업데이트시
 * @param {*} module
 */
function nocache(module, callback) {
	fs.watchFile(
		path.resolve(module),
		() => {
			delete require.cache[require.resolve(module)];
			callback(module);
		},
	);
}
const loadFile = (dir, libs) => {
	const name = path.basename(dir, '.js');
	try {
		const cmd = require(dir);
		
		if ( log ) console.log(`[파일관리자]${libs[name] ? '갱신' : '신규'} - ${dir}`);
		// 캐시가 없는 경우에만 or 개발 모드일 경우 동작
		if (cli?.mode == "development" && !libs[name]) nocache(dir, (d) => loadFile(d, libs));
		libs[name] = cmd;
	}
	catch (e) {
		console.error(e);
		if ( log ) onsole.log(`[파일관리자] 파일 제거 - ${dir}`);
		try { delete libs[name]; } catch (e) { ; }
	}
};


let log = true;
/**
 * 커맨드 관리 모델
 * @param {*} target 탐색위치
 */
 module.exports = function getCommands(target, isLog = true) {
	const libs = {};
	const commandFolders = fs.readdirSync(target).filter(file => file.endsWith('.js'));
	log = isLog; // 로그 기록 여부
	 
	if( log ) console.log(`[파일관리자] 지정경로 - ${target}`);
	for (const file of commandFolders) {loadFile(path.join(target, file), libs);}

	const get = (name) => libs[name] || libs[Object.keys(libs).find(k => (libs[k].name && libs[k].name == name) || (libs[k].aliases && libs[k].aliases.includes(name)))];
	return {
		...libs,
		options : Object.values(libs),
		get,
		add: (name) => loadFile(path.join(target, name)),
		execute: function(interaction, commandName, ...args) {
			const command = get(commandName);
			if (command) {
				let obj;
				if (typeof command == 'function')obj = command;
				else if ('execute' in command)obj = command.execute;
				else obj = () => {};
				obj(interaction, ...args);
			}
		},
		forEach: (callback) => {
			const keys = Object.keys(libs);
			for(const k of keys) {
				callback(libs[k], k, libs)
			}
			return keys;
		},
		getHelp : () => [...this.command.values()].map(
			cmd => cmd.type == 1 ? { ...cmd } : {
				name : cmd.name,
				description : cmd.description,
				help : cmd.help,
			}
		),
		getCommands : () => Object.values(libs) // 명령필터
			.map( cmd =>{
				const out = {};
				for (const optionName of commandOptionNames)
					if(optionName in cmd)
						out[optionName] = cmd[optionName];
				
				return out;
			}).map( o => ({ // 기본 권한이 없을경우 모든 권한으로 설정
				default_member_permissions : 1n << 10n, // ViewChannel
				dm_permission : false, // dmChannel
				...o,
			})),
	};
};
