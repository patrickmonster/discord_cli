'use strict';

const path = require("path");
const name = path.basename(__filename,".js");

module.exports = {
	name,
	description: '명령의 도움말을 표기 합니다.',
	aliases: ['도움말', 'h', '?'],
	help: `${name}`,
	execute(message) {
		const { channel, client } = message;
		channel.send({
			embeds : [
				client.getEmbed().setTite("채팅명령어").setDescription(` \`\`\`ansi
${client.eventMessage.getHelp().map(({name, description, help}) => `[0;31m឵${name}[0m឵ - ${description || "..."} [0;34m឵${help || "?"}[0m឵`).join("\n")} \`\`\` 
				` )
			],
		});
	}
};