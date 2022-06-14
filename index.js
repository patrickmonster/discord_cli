const discord_js = require("discord.js");

const BasicClient = require("./src/Client");
const DBClient = require("./src/DBClient");


// 커맨드 로더 관리자 - 라이브 코딩
const LoadCommands = require("./src/Util/updateCode");


module.exports = {
    ...discord_js,
    Client : BasicClient,
    DBClient,
    LoadCommands,
};