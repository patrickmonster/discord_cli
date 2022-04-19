'use strict';
const { CommandManager }= require("@patrickmonster/discord_cli");
const package = require("./package.json");

CommandManager(package.token, "Button", "Menu");
