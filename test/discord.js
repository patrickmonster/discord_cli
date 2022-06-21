const { Client, Intents } = require("../index");

const client = new Client({
    intents : [ Intents.FLAGS.DIRECT_MESSAGES ]
});

client.on("ready", ()=>{
    client.logger(`${client.user.tag}`);
}).login(process.env.DISCORD_TOKEN).catch(client.logger);