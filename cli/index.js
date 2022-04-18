const inquirer = require("inquirer");
const fs = require("fs");
// import createDirectoryContents from './createDirectoryContents.js';
const CURR_DIR = process.cwd();

let i = 0
const CHOICES = fs.readdirSync(`${__dirname}/templates`);

const QUESTIONS = [
  {
    name: 'work-type',
    type: 'list',
    message: '어떤 작업을 하실건가요?',
    choices: [ "1","2" ],
  },
  // {
  //   name: 'wok-name',
  //   type: 'input',
  //   message: 'Project name:',
  //   validate: function (input) {
  //     if (/^([A-Za-z\-\\_\d])+$/.test(input)) return true;
  //     else return 'Project name may only include letters, numbers, underscores and hashes.';
  //   },
  // },
  
  
];




console.log(`
██████╗ ██╗███████╗ ██████╗ ██████╗ ██████╗ ██████╗          ██████╗██╗     ██╗
██╔══██╗██║██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔══██╗        ██╔════╝██║     ██║
██║  ██║██║███████╗██║     ██║   ██║██████╔╝██║  ██║        ██║     ██║     ██║
██║  ██║██║╚════██║██║     ██║   ██║██╔══██╗██║  ██║        ██║     ██║     ██║
██████╔╝██║███████║╚██████╗╚██████╔╝██║  ██║██████╔╝███████╗╚██████╗███████╗██║
╚═════╝ ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝╚══════╝╚═╝`);



console.log('‎')
inquirer.prompt(QUESTIONS).then(answers => {
  console.log(answers);
  // const projectChoice = answers['project-choice']; 


  // const projectName = answers ['project-name']
  
 
  // const templatePath = `${__dirname}/templates/${projectChoice}`;

  // fs.mkdirSync(`${CURR_DIR}/${projectName}`);

  // console.log(chalk.whiteBright('⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯'))
  // console.log('‎')
  // console.log(chalk.yellowBright.italic('Thanks for using ') + chalk.italic.greenBright('Dgen ') + chalk.yellowBright.italic('if you need any help please join our discord server' ))
  // console.log('‎')
  // console.log('‎')
  // console.log('┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄')
  // console.log('‎')
  // console.log(chalk.bold.yellowBright('How to use ?'))
  // console.log('‎')
  // console.log(chalk.cyanBright('➦ ') + chalk.whiteBright.bold(' Step 1 - ') + chalk.cyanBright.italic(`\`cd ${projectName}\``))
  // console.log('‎')
  // console.log(chalk.cyanBright('➨ ') + chalk.whiteBright.bold(' Step 2 - ') + chalk.cyanBright.italic('Please edit ') + chalk.italic.magentaBright('.env ') + chalk.cyanBright.italic('file'))
  // console.log('‎')
  // console.log(chalk.cyanBright('➥ ') + chalk.whiteBright.bold(' Step 3 - ') + chalk.cyanBright.italic('`npm start`'))
  // console.log(chalk.whiteBright('⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯'))

  // createDirectoryContents(templatePath, projectName);
})
