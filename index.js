const discord_js = require("discord.js");
const { Modal, TextInputComponent, showModal } = require('discord-modals') // Modal class

const BasicClient = require("./src/BasicClient");
const LoadCommands = require("./src/commands");
const LoadSubCommands = require("./src/Util/getCommands");
const CommandManager = require("./src/CommandManager");

module.exports = {
    BasicClient,
    LoadCommands,
    LoadSubCommands,
    CommandManager,
    Modal, TextInputComponent, showModal,
    ...discord_js,
};