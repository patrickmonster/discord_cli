'use strict';
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const getCommands = require("./Util/getCommands");
const path = require("path");

let discord;
function CommandManager(token, ...dirs){
    discord = new REST({ version: '9' }).setToken(token);
    discord.get(Routes.user()).then(({id, username, discriminator})=>{
        console.log(`${username}#${discriminator}](${id}) Command Update`);
        const apps = [];
        for(const dir of dirs){
            apps.push(...getCommands(path.join(process.cwd(), dir)).getApp());
        }
        return discord.put(Routes.applicationCommands(id)),{ body  : apps };
    }).then(()=>{
        console.log(`Command Register Comp!`);
        process.exit(0);
    }).catch(e=>{
        console.error(e.rawError.message, JSON.stringify(e.rawError.errors));
        process.exit(1);
    });
}

module.exports = CommandManager;