const { Client, Intents } = require('../index');

const client = new Client({
	intents: [Intents.FLAGS.DIRECT_MESSAGES],
});

client
	.on('ready', () => {
		client.logger(`${client.user.tag} 서비스 준비 완료`);
	})
	.login(process.env.DISCORD_TOKEN)
	.catch(client.logger);