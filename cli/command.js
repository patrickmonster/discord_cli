'use strict';
const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const updateCode = require("../src/Util/updateCode");
const fetch = require("node-fetch");



const package_option = require("../package.json");

////////////////////////////////////////////////////////////////////////////
const DISCORD_USER = (id) => `/users/${id}`;
const DISCORD_COMMANDS = (appid) => `/applications/${appid}/commands}`;
/////////////////////////////////////////////////////////////////a///////////
inquirer.registerPrompt('search-checkbox', require('inquirer-search-checkbox'));

const commandFolders = fs.readdirSync(process.cwd()).filter(file => !(file[0] == ".") && fs.lstatSync(file).isDirectory());

console.log(`
=================================================================
Disocrd - Commands update tool

명령을 간편하게 업데이트 하는 기능입니다.
해당 기능은, 모든 글로벌 명령을 업데이트 하기에
기존의 명령 설정이 변경 될 수 있습니다.

@patrickmonster/discord_cli 의 LoadCommands내부 기능을 통하여 
명령을 불러옵니다.

해당 형식은, discord 공식 문서
[ https://discord.com/developers/docs/interactions/application-commands#application-command-object ]
를 따르고 있으며, discord.js 명령 업데이트 형식과 무관 합니다.
=================================================================
`)

inquirer
    .prompt([{
        name: "commands",
        message: "명령어가 있는 폴더를 선택 해 주세요(앱/슬레시커맨드) :",
        type: "search-checkbox",
        choices: commandFolders
    }, {
        name: 'token',
        type: 'password',
        message: '봇 토큰을 입력 해 주세요!',
    }])
    .then(({commands, token}) => {
        const headers = {
            Authorization: `Bot ${token}`,
            "Content-Type": "application/json",
        };

        // 파일 옵션을 불러옴
        const commandsOptions = commands.map(file => updateCode(path.join(process.cwd(), file)).getCommands()).flat();

        fetch( DISCORD_USER, { method: "GET", headers: JSON.stringify(headers)}).then(({body: { id, username, discriminator }})=>{
	        console.log(`${username}#${discriminator}](${id}) 명령어 업데이트 - V.${package_option.version}`);
            return fetch( DISCORD_COMMANDS, { method: "GET", headers: JSON.stringify(headers), body : commandsOptions.flat()});
        }).then(({body}) =>{
            console.log(`${body.length}항목 명령어 업데이트 - 성공`);
            process.exit();
        }).catch(err =>{
            console.error(`네트워크문제 혹은 토큰이 올바르지 않거나, 문서가 형식에 맞지 않습니다!`);
            console.error(err);
	        process.exit();
        })
        
    });