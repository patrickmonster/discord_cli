'use strict';
const inquirer = require("inquirer");
console.log(`
██████╗ ██╗███████╗ ██████╗ ██████╗ ██████╗ ██████╗          ██████╗██╗     ██╗
██╔══██╗██║██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔══██╗        ██╔════╝██║     ██║
██║  ██║██║███████╗██║     ██║   ██║██████╔╝██║  ██║        ██║     ██║     ██║
██║  ██║██║╚════██║██║     ██║   ██║██╔══██╗██║  ██║        ██║     ██║     ██║
██████╔╝██║███████║╚██████╗╚██████╔╝██║  ██║██████╔╝███████╗╚██████╗███████╗██║
╚═════╝ ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝╚══════╝╚═╝`);

console.log('‎')
inquirer.prompt({
  name: 'work-type',
  type: 'list',
  message: '어떤 작업을 하실건가요?',
  choices: [
    "프로젝트 생성",
    "클라이언트 이벤트 추가",
    "데이터베이스 설정",
    new inquirer.Separator(),
  ].map((name, value) => typeof name == "string" ? { name, value } : name),
}).then(answers => {
  switch (answers["work-type"]) {
    case 0:
      require("./create");
      break;
    case 1:
      require("./event");
      break;
    case 2:
      require("./sql");
      break;
  }
})