'use strict';
const { Client } = require('discord.js');

const discordModals = require('discord-modals');
const fs = require('fs');
const path = require("path");

/* ============================================================================================ */
const getCommands = require("./Util/getCommands");
const init = require('./Util/init');

class BasicClient extends Client{
    constructor(clientOptions){
        super(clientOptions);

        discordModals(this);
        init(this, `${__dirname}/base`);

        clientOptions = clientOptions || {};
        
        const baseDir = path.join(process.cwd(), clientOptions.eventDir || "event");
        if(fs.existsSync(baseDir))
            this.#getBaseEvents();
        else {
            fs.mkdirSync(baseDir);
            this.logger.error("이벤트 폴더를 찾을 수 없습니다!", baseDir);
            require('../cli/event');
        }
        
        if(process.env.DISCORD_TOKEN)
            this.login(process.env.DISCORD_TOKEN).catch(this.logger.error)
    }

    /**
     * 실행 영역 기준으로 해당 디렉토리에 이벤트가 있는지 여부 확인
     */
    #getBaseEvents(){
        const {command} = getCommands(path.join(process.cwd(),"event"));
        const _this = this;
        for (const key of command.keys()){
            _this.logger.log("Load event]",key);
            _this.on(key, (...l)=>{
                const cmd = command.get(key);
                try{
                    cmd.call(_this, ...l);
                }catch(e){
                    this.logger.error(e)
                }
            })
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