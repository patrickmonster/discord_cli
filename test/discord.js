const { BasicClient, Intents } = require("../index");

const client = new BasicClient({
    intents : [ Intents.FLAGS.DIRECT_MESSAGES ]
});

client.on("ready", ()=>{
    client.logger(`${client.user.tag}`);
}).login("OTQwNTg4OTczNTc3ODgzNjQ4.YgJlvg.Q9zIu5bTQgOQN59JudjaYqgtPDQ").catch(client.logger);