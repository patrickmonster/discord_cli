const DBClient = require('../src/DBClient');



const client = new DBClient({});

setTimeout(()=>{

    // insert user data
    client.User = {
        accentColor : 333333
        , id : "00000000"
        , tag : "1111"
        , username : "test"
        , avatar : ""
        , banner : ""
    }

    client.getUser("00000000").then(user=>{
        console.log(user);
    })
}, 1000 )