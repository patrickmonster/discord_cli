const { BasicClient, Intents } = require("../index");

const DBClient = require('../src/DBClient');



const client = new DBClient({
    intents : [ Intents.FLAGS.DIRECT_MESSAGES ]
});

client.on("ready", ready);

function ready(){
    // insert user data
    // client.User = { 

    // client.getUser("00000000").then(user=>{
    //     console.log(user);
    // })

    // client.Table.createTable("test", table);
    // client.Table.removeColumn("User", "test")//.then(_=>)
}

setTimeout(ready, 1000);