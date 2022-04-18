const discord_js = require("discord.js");
const { Modal, TextInputComponent, showModal } = require('discord-modals') // Modal class

const BasicClient = require("./src/BasicClient");
const BasicShard = require("./src/BasicShard");
const LoadCommands = require("./src/commands");

module.exports = {
    BasicShard,
    BasicClient,
    LoadCommands,
    Modal, TextInputComponent, showModal,
    ...discord_js,
};