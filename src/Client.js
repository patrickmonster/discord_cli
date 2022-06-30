'use strict';
const { Client, ClientOptions } = require('discord.js');
const EventEmitter = require('node:events');

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


// extends EventEmitter
class BasicClient 
    extends 
        Client
        // EventEmitter
    {
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
            console.error("설정이 완료되면, 프로그램을 다시 시작해 주세요.");
            require('../cli/event');
        }
    }

    /**
     * 
     */
    get logger(){
        const name = this.user?.tag || "BOT";
        const logPrint = (lvl) => {
            return (...args)=>{    
                if (levels[lvl] >= levels[level])
                    console.log(`${formattedDate()}]${name}`, ...args);
            }
        }
        const log = logPrint('log');
        log.log = logPrint('none');
        log.info = logPrint('info');
        log.warn = logPrint('warn');
        log.error = logPrint('error');
        log.debug = logPrint('debug');
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