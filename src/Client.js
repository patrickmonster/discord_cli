'use strict';
const { Client, ClientOptions } = require('discord.js');

const fs = require('fs');
const path = require("path");

/* ============================================================================================ */
const updateCode = require("./Util/updateCode");


const levels = {
    'debug': 0,
    'warn': 1,
    'info': 2,
    'none': 3,
    'log': 3,
    'error': 4,
}

let level = 'warn';
const formattedDate = _ => {
    const date = new Date();
    const hours = `00${date.getHours()}`.slice(-2);
    const mins = `00${date.getMinutes()}`.slice(-2);
    const seconds = `00${date.getSeconds()}`.slice(-2);
    return `${hours}:${mins}:${seconds}`;
}
const log = lvl => {
    return (...args) => {
        if (levels[lvl] >= levels[level])
            console.log(`${formattedDate()}]${name}`, ...args);
    }
}
class BasicClient extends Client{
    /**
     * 
     * @param { ClientOptions } clientOptions 
     */
    constructor(clientOptions){
        super(clientOptions);
        const _this = this;

        _this._logLevel = clientOptions.logLevel; // 경고래벨

        clientOptions = clientOptions || {};
        updateCode( path.join(__dirname, 'base'), false).forEach((value, key)=>_this[key] = value);
        
        const baseDir = path.join(process.cwd(), clientOptions.eventDir || "Event");
        if(fs.existsSync(baseDir))
            updateCode( baseDir, false ).forEach((func, event)=> {
                console.log("클라이언트 이벤트 매니저(등록) :", event);
                _this.on(event, func)
            });
        else {
            fs.mkdirSync(baseDir);
            console.error("이벤트 폴더를 찾을 수 없습니다!", baseDir);
            require('../cli/event');
            console.error("설정이 완료되면, 프로그램을 다시 시작해 주세요.");
        }
    }

    /**
     * 
     */
    get logger(){
        const name = this.user?.tag || "BOT";
        const log = (...args) => {
            if (4 >= levels[level])
                console.log(`${formattedDate()}]${name}`, ...args);
        };
        log.log = log('none');
        log.info = log('info');
        log.warn = log('warn');
        log.error = log('error');
        log.debug = log('debug');
        return log;
    }

    getTotalGuild(){
        const { cache } = this.guilds;
        return {
            size : cache.size,
            users : cache.reduce((acc, guild) => acc + guild.memberCount, 0)
        };
    }
}

module.exports = BasicClient;