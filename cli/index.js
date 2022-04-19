const inquirer = require("inquirer");
const fs = require("fs");
const CHOICES = fs.readdirSync(`${__dirname}/templates`);

console.log(`
██████╗ ██╗███████╗ ██████╗ ██████╗ ██████╗ ██████╗          ██████╗██╗     ██╗
██╔══██╗██║██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔══██╗        ██╔════╝██║     ██║
██║  ██║██║███████╗██║     ██║   ██║██████╔╝██║  ██║        ██║     ██║     ██║
██║  ██║██║╚════██║██║     ██║   ██║██╔══██╗██║  ██║        ██║     ██║     ██║
██████╔╝██║███████║╚██████╗╚██████╔╝██║  ██║██████╔╝███████╗╚██████╗███████╗██║
╚═════╝ ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝╚══════╝╚═╝`);



console.log('‎')
inquirer.prompt(
  {
    name: 'work-type',
    type: 'list',
    message: '어떤 작업을 하실건가요?',
    choices: [ 
      "프로젝트 생성",
      "클라이언트 이벤트 추가",
      "데이터베이스 설정",
      new inquirer.Separator(),
    ].map((name,value)=>({name,value})),
  }).then(answers => {
  console.log(answers);
  switch(answers["work-type"]){
    case 1:
    case 2:
    case 3:
      break;
  }
})
