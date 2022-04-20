const fs = require('fs');
const path = require('path');
const inquirer = require("inquirer");

var { ncp } = require('ncp');
ncp.limit = 16;

const packageName = path.join(process.cwd(), "package.json");

if(!fs.existsSync(packageName)){
    console.log("SQL]","프로젝트 설정이 되지 않았습니다! (현 디랙토리에서 package.json 파일을 찾을 수 없음!)");
    process.exit(1);
}


/*
*/
const package = require(packageName);

const choices = [
    "초기설정",
    new inquirer.Separator(),
    new inquirer.Separator(),
    // "데이터 베이스 설정 변경",
    "데이터 베이스 동기화(클라이언트에 맞춤)",
    "데이터 베이스 동기화(서버에 맞춤)",
    new inquirer.Separator(),
    // "테이블 생성",
    // "테이블 삭제",
].map((name,value)=>typeof name == "string" ? {name,value} : name);

inquirer.prompt([{
    name: 'sql-work',
    type: 'list',
    message: '작업을 선택해 주세요!',
    choices,
},{
    name: 'sql-type',
    type: 'list',
    message: '작업을 선택해 주세요!',
    choices : [
        "sqlite(로컬디비)",
        new inquirer.Separator(),
        "MySql(서버)",
        "PostgreSQL(서버)",
        "MariaDB(서버)",
        // "OracleDB(서버)",
    ].map((name,value)=>typeof name == "string" ? {name,value} : name),
}]).then(answers => {
    const options = package.database ?? {};

    switch(answers["sql-work"]){
        case 0: // 초기설정
        case 2: // 설정변경
            ncp(path.join(__dirname, "templates","models"), path.join(process.cwd(), "models"), async function (err) {
                if (err) return console.error(err);
                switch(answers["sql-type"]){
                    case 0: // sqlite
                        options.storage = path.join(process.cwd(), "discord.db");
                        options.dialect = "sqlite";
                        break;
                    case 2: // MYSQL
                    case 3: // Postgre
                    case 4: // Mongo
                    // case 5: // Oracle
                        const { database, username, password, host } = await inquirer.prompt([
                            {
                                name: 'host',
                                type: 'input',
                                message: '사용하실 데이터베이스 주소를 입력 해 주세요!',
                            },
                            {
                                name: 'database',
                                type: 'input',
                                message: '사용하실 데이터베이스 이름을 입력 해 주세요!',
                            },
                            {
                                name: 'username',
                                type: 'input',
                                message: '사용자 이름을 입력 해 주세요!',
                            },
                            {
                                name: 'password',
                                type: 'password',
                                message: '사용자 비밀번호를 입력 해 주세요!',
                            },
                        ]);
                        options.database = database;
                        options.username = username;
                        options.password = password;
                        options.host = host;
                        options.dialect = ["sqlite","","mysql", "postgres", "mariadb"][answers["sql-type"]];
                }
                package.database = options;
                fs.writeFileSync(packageName, JSON.stringify(package));
                console.log("설정이 완료되었습니다!");
                process.exit(0);
            });
            break;
        case 3: // 동기화 - 서버
        case 4: // 동기화 - 클라이언트
            if(!options){
                console.log("설정값이 없습니다! 초기설정을 먼저 진행 해 주세요!");
                process.exit(1);
            }
            const { sequelize } = require("./templates/models/index");
            if(answers["sql-work"] == 3){ // 서버 동기화
                console.log("로컬파일 동기화 시작...")
                sequelize.sync().then(data=>{
                    console.log("동기화가 완료되었습니다!", data);
                    process.exit(0);
                }).catch(console.error);
            }else{
                console.log("서버와 동기화 시작...")
                const SequelizeAuto = require('sequelize-auto');
                new SequelizeAuto(options.database, options.username, options.password, options).run(err=>{
                    if(err)console.error(err);
                    else console.log("동기화가 완료되었습니다!");
                    process.exit(0);
                });
            }
            break;
        // case 6: // 테이블 생성
        // case 7: // 테이블 삭제
            break;
    }
});
