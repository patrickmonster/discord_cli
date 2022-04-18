const discord_js = require("discord.js");
const BasicClient = require("./src/BasicClient");

module.exports = {
    BasicClient,
    ...discord_js,
};