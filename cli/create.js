'use strict';
const inquirer = require("inquirer");
const path = require("path");
const options = require("../package.json");
const fs = require("fs");
const {
    ncp
} = require('ncp');
const {
    exec
} = require('child_process');


const packageObject = {
    "version": "1.0.0",
    "main": "discord.js",
    "scripts": {
        "start": "node discord.js"
    },
    "keywords": ["discord.js", "djs-cli", "patrickmonster"],
    "author": "",
    "license": "ISC",
    "dependencies": {
        "@patrickmonster/discord_cli": `^${options.version}`,
        "discord.js": "^13.6.0"
    }
}


inquirer.prompt({
    name: 'project-name',
    type: 'input',
    message: '프로젝트 이름을 입력 해 주세요!',
    validate: function (input) {
        if (/^([A-Za-z\-\\_\d])+$/.test(input)) return true;
        else return 'Project name may only include letters, numbers, underscores and hashes.';
    },
}, {
    name: 'project-token',
    type: 'input',
    message: '봇 토큰을 입력 해 주세요!',
}, ).then(({
    'project-name': name
}) => {
    console.log("프로젝트를 복제하는중...", name);
    ncp(path.join(__dirname, "templates", "init"), path.join(process.cwd(), name), async function (err) {
        if (err) return console.error(err);
        const packageName = path.join(process.cwd(), name, "package.json");
        packageObject.name = name;
        fs.writeFileSync(packageName, JSON.stringify(packageObject));
        exec(`cd ${name} | npm i`, function (error, stdout, stderr) {
            console.log(stdout, stderr);
            if (error !== null) return console.error(error);
            // fs.mkdirSync(path.join(process.cwd(), name, "event"));// 클라이언트 이벤트 처리용
            console.log("프로젝트를 복제가 완료도었습니다!", name);
            process.exit(0);
        });
    });
});