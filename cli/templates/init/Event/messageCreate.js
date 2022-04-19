const { TextBasedChannelMixin } = require("discord.js");

const prefix = "!";

module.exports = (message) =>{
	const { content, channel, client } = message;

	const [ command, ...args] = content.split(" ");
	if(command.startwith(prefix)){
		const cmd = this.eventMessage.get(command.substr(1));
		if(cmd) cmd.execute.call(this,message, ...args);
	}
}