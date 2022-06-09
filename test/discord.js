const { BasicClient, Intents } = require("../index");

const client = new BasicClient({
    intents : [ Intents.FLAGS.DIRECT_MESSAGES ]
});

client.on("ready", ()=>{
    client.logger(`${client.user.tag}`);
}).login("").catch(client.logger);