'use strict';
const { Client, Intents, LoadCommands }= require("@patrickmonster/discord_cli");
const path = require("path");

const package = require("./package.json");
process.env.DISCORD_TOKEN = process.env.DISCORD_TOKEN || package.token;

const client = Client({
	intents : [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES
    ],
	partials: ['CHANNEL'],
}).once('ready', ()=>{
	client.logger.setLevel('debug'); 
	client.logger.setName(this.user.tag);
    // other services...
});

// 클라이언트 이벤트
LoadCommands(path.join(__dirname, "Event")).forEach((func, name) => client.on(name, func));

// 보조 명령리스트 불러오기
client.eventButton = LoadCommands(path.join(__dirname, "Button"));
client.eventMessage = LoadCommands(path.join(__dirname, "Message"));

client.eventCommand = LoadCommands(path.join(__dirname, "Command"));
client.eventAppCommand = LoadCommands(path.join(__dirname, "AppCommand"));

client.login(process.env.DISCORD_TOKEN).catch(client.logger.error);
