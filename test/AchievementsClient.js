const { Intents } = require("../index");

const AchievementsClient = require('../src/AchievementsClient');



const client = new AchievementsClient({
    intents : [ Intents.FLAGS.DIRECT_MESSAGES ]
});

client.on("ready", ready)
    .on("achievementCreate", function(User, achievement_id){
        console.log("업적 생성",User, achievement_id);
    })
    .on("achievementDelete", function(User, achievement_id){
        console.log("업적 삭제",User, achievement_id);
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

    client.achievementComplete({id : "00000000000000000000"}, 6);

    setTimeout(function(){
        // client.achievementComplete({id : "00000000000000000000"}, 6);
        client.achievementDelete({id : "00000000000000000000"}, 6);
        // client.achievement.then(achievement => {
        //     console.log("조회",achievement);
        // })
        // client.getAchievement({id : "00000000000000000000"}).then(console.log);
        // client.getReaderBord({id : "00000000000000000000"}).then(console.log);
    }, 1000);
}


// console.log(client);

setTimeout(()=>{
    client.emit("ready");
}, 1000);