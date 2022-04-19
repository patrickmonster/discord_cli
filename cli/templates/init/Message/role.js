'use strict';
const { LoadCommands }= require("@patrickmonster/discord_cli");

const path = require("path");
const name = path.basename(__filename,".js");

module.exports = {
	name,
	description : "역할 관련 옵션입니다.",
	...LoadCommands(path.join(__dirname, name))
};