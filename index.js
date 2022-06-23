const discord_js = require("discord.js");

const BasicClient = require("./src/Client");
const DBClient = require("./src/DBClient");
const AchievementsClient = require("./src/AchievementsClient");


// 커맨드 로더 관리자 - 라이브 코딩
const LoadCommands = require("./src/Util/updateCode");
const DBColumn = require("./src/Util/DBColumn");


module.exports = {
    ...discord_js,
    Client : BasicClient,
    DBClient, // 디비 클라이언트
    AchievementsClient, // 리더보드 클라이언트
    DBColumn,
    LoadCommands,
};