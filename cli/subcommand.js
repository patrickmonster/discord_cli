'use strict';
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const sub = `
/**
 * options
 */
`;

inquirer.prompt([
    {
        name: 'command-name',
        type: 'input',
        message: '명령이름을 입력 해 주세요.',
        validate: function (input) {
            if (/^([ㄱ-ㅎ가-힣A-Za-z\-\\_\d])+$/.test(input)) return true;
            else return 'Project name may only include letters, numbers, underscores and hashes.';
        },
    },
    {
        name: 'command-type',
        type: 'list',
        message: '명령타입을 설정해 주세요',
        choices : [
            new inquirer.Separator(),
            "슬레시커맨드 명령", // 
            "유저입력 명령",
            "메세지 명령",
            new inquirer.Separator(),
            "슬레시커맨드 라우팅(명령 관리용 라우팅)",
            "명령 라우팅(명령 관리용 라우팅)",
        ].map((name,value)=>typeof name == "string" ? {name,value} : name),
    },
]).then(({'command-name': name, 'command-type' : type }) => {
    const dir = path.join(process.cwd(),name);
    switch(type){
        case 1: // 채팅입력
        case 2: // 사용자
        case 3: // 메세지
        fs.writeFileSync(`${dir}.js`,`'use strict';
const path = require("path");
const name = path.basename(__filename,".js");

${type == 1 ? '' : ''}

/**
 * ${name}.js - 명령 이벤트
 *  create ${new Date()}
 * @param { String } name 이름
 * @param { String } description 설명
 * @param { String } type [ CHAT_INPUT : 1, USER : 2, MESSAGE : 3 ] 메세지 타입
 * @param { boolean } defaultPermission 앱이 길드에 추가될때 기본적으로 활성화 되는지 여부
 * 
 * @param { Array } options 매세지 커맨드 보조 옵션
 */
module.exports = {
    name,
    type : ${type},
    default_permission : true,${type== 1 ? `\n\tdescription : '${name} 관련 명령',` : "" }
    execute(interaction) {
        // ...other sorce
    }
};`
            );
            !fs.existsSync(dir) && fs.mkdirSync(dir);
            break;
        case 5:
            fs.writeFileSync(`${dir}.js`,`'use strict ';
const { LoadCommands } = require('@patrickmonster/discord_cli');

const path = require("path");
const name = path.basename(__filename,".js");

/**
 * ${name}.js - 명령 이벤트
 *  create ${new Date()}
 * @param { String } name 이름
 * @param { String } description 설명
 * @param { String } type [ CHAT_INPUT, USER, MESSAGE ] 메세지 타입
 * @param { boolean } defaultPermission 앱이 길드에 추가될때 기본적으로 활성화 되는지 여부
 */
module.exports = {
	name,${type == 1 ? `
	type : 1, // [chat input, user, message] 
	default_permission : true,` : ''}
	description : '${name} 관련 명령',
    ...LoadCommands(path.join(__dirname, name), function(event){
        // 하위 명령어가 있는경우 처리전에 호출 됩니다.
    }, function(event){
        // 하위 명령어가 없는경우 호출됩니다.
        // (인터랙션은, 해당 함수를 지우시면 자동으로 응답합니다)
    }),
};`
            );
            !fs.existsSync(dir) && fs.mkdirSync(dir);
            break;
    }
});