const { Intents } = require("../index");

const AchievementsClient = require('../src/AchievementsClient');



const client = new AchievementsClient({
    intents : [ Intents.FLAGS.DIRECT_MESSAGES ]
});

client.on("ready", ready)
    .on("AchievementCreate", function(User, achievement_id, guild){
        console.log("업적 이벤트",User, achievement_id, guild);
    })

function ready(){
    // insert user data
    // client.User = { 

    // client.getUser("00000000").then(user=>{
    //     console.log(user);
    // })

    // client.Table.createTable("test", table);
    // client.Table.removeColumn("User", "test")//.then(_=>)
    // client.achievement = {
    //     name : "일단 넣어 업적"
    //     , description : "테스트 업적"
    //     , type : "TEST"
    //     , EventType : "CreatedMember"
    // }

    // client.achievementComplete({id : "00000000000000000000"}, 2);

    setTimeout(function(){
        // client.achievement.then(achievement => {
        //     console.log("조회",achievement);
        // })
        // client.getAchievement({id : "00000000000000000000"}).then(console.log);
        client.getReaderBord({id : "00000000000000000000"}).then(console.log);
    }, 1000);
}


// console.log(client);

setTimeout(()=>{
    client.emit("ready");
}, 1000);