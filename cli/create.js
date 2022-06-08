'use strict';
const inquirer = require("inquirer");
const path = require("path");
const options = require("../package.json");
const fs = require("fs");
const {
    ncp
} = require('ncp');
const {
    exec, spawn
} = require('child_process');

inquirer.prompt({
    name: 'project-name',
    type: 'input',
    message: '프로젝트 이름을 입력 해 주세요 :',
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
    ncp(path.join(__dirname, "templates", "init"), path.join(process.cwd(), name),      function (err) {
        if (err) return console.error(err);

        console.log("프로젝트를 설치하는중...", name);
        spawn(`cd`, [
            `${path.join(process.cwd(), name)}`,
            "&&",
            "npm",
            "i"
        ], {stdio: 'inherit',shell: true}).on("close", process.exit);
    });
});