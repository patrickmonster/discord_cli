const inquirer = require("inquirer");
const fs = require("fs");
var { ncp } = require('ncp');
const CHOICES = fs.readdirSync(`${__dirname}/templates`);

const { exec } = require('child_process');

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
    ].map((name,value)=>typeof name == "string" ? {name,value} : name),
  }).then(answers => {
  switch(answers["work-type"]){
    case 0:
      inquirer.prompt(
        {
          name: 'project-name',
          type: 'input',
          message: '프로젝트 이름을 입력 해 주세요!',
          validate: function (input) {
            if (/^([A-Za-z\-\\_\d])+$/.test(input)) return true;
            else return 'Project name may only include letters, numbers, underscores and hashes.';
          },
        },
        {
          name: 'project-token',
          type: 'input',
          message: '봇 토큰을 입력 해 주세요!',
        },
      ).then(({'project-name' : name})=>{
        console.log("프로젝트를 복제하는중...", name);
        ncp(path.join(__dirname, "templates","init"), path.join(process.cwd(), name), async function (err) {
          if (err) return console.error(err);
          exec( `${path.join(process.cwd(), name,"npm")} init -y`,function (error, stdout, stderr) {
            console.log(stdout, stderr);
            if (error !== null) return console.error(error);
            // fs.mkdirSync(path.join(process.cwd(), name, "event"));// 클라이언트 이벤트 처리용
            console.log("프로젝트를 복제가 완료도었습니다!", name);
            process.exit(0);
         });
        });
      });
      break;
    case 1:
    case 2:
      break;
  }
})
