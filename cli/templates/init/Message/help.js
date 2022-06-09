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
			embeds : [ // TODO: 모바일에서는 정상적으로 보이지 않음이 확인 되었습니다.
				client.getEmbed().setTite("채팅명령어").setDescription(` \`\`\`ansi
${client.eventMessage.getHelp().map(({name, description, help}) => `[0;31m឵${name}[0m឵ - ${description || "..."} [0;34m឵${help || "?"}[0m឵`).join("\n")} \`\`\` 
				` ),
				client.getEmbed().setTite("버튼명령어").setDescription(` \`\`\`ansi
${client.eventButton.getHelp().map(({name, description, help}) => `[0;31m឵${name}[0m឵ - ${description || "..."} [0;34m឵${help || "?"}[0m឵`).join("\n")} \`\`\` 
				` )
			],
		});
	}
};