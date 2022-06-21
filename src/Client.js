'use strict';
const { Client, ClientOptions } = require('discord.js');

const fs = require('fs');
const path = require("path");

/* ============================================================================================ */
const updateCode = require("./Util/updateCode");

class BasicClient extends Client{
    /**
     * 
     * @param { ClientOptions } clientOptions 
     */
    constructor(clientOptions){
        super(clientOptions);
        const _this = this;

        clientOptions = clientOptions || {};
        updateCode( path.join(__dirname, 'base')).forEach((value, key)=>_this[key] = value);
        
        const baseDir = path.join(process.cwd(), clientOptions.eventDir || "event");
        if(fs.existsSync(baseDir))
            updateCode( baseDir ).forEach((func, event)=> {
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

    getTotalGuild(){
        const { cache } = this.guilds;
        return {
            size : cache.size,
            users : cache.reduce((acc, guild) => acc + guild.memberCount, 0)
        };
    }
}

module.exports = BasicClient;