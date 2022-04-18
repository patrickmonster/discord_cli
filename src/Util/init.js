const fs = require('fs');
const path = require("path");

/**
 * 모듈 캐시 제거 - 파일업데이트시
 * @param {*} module
 */
function nocache(module, callback) {
	fs.watchFile(
		path.resolve(module), () => {
			delete require.cache[require.resolve(module)];
			callback(module);
		});
}

/**
 * 모듈 관리자
 * 
 * 자동으로 모듈을 업데이트 함
 * @param {*} client
 * @param {*} target
 */
function load(client, target) {
	const name = path.basename(target,".js");
	try {
		console.log(`[파일관리자] ${name} - ${target}`);
		const func = require(target);
		client[name] = function(...args) {
			try {return func.call(client, ...args); } catch (e) { console.error(`[명령실행오류] ${name}`); }
		};
	} catch (e) {
		console.log(`[파일관리자] 파일제거(경고)- ${target}`);
	}
}

/**
 * 파일 관리자 - 파일 업데이트시 종료되지 않고 파일을 관리함
 * @param {*} client 
 * @param {*} target 
 * @returns 
 */
module.exports = function(client, target) {
	const commandFolders = fs.readdirSync(target).filter(file => file.endsWith('.js'));
	for (const file of commandFolders) {
		const dir = path.join(target, file);
		try {
			load(client, dir);
			nocache(dir, (p) => {
				load(client, p);
			});
		}
		catch (e) {
			console.log(`[파일관리자]잘못된 정의 - ${dir}`);
		}
	}

	return () => {
		const commandFolders = fs.readdirSync(target).filter(file => file.endsWith('.js'));
		for (const file of commandFolders) {
			const dir = path.join(target, file);
			delete require.cache[require.resolve(dir)];
			try {
				load(client, dir);
			}
			catch (e) {
				console.log(`[파일관리자] 파일제거(경고)- ${target}`);
			}
		}
	};
};
