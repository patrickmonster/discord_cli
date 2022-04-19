const { Routes } = require('discord-api-types/v9');


/**
 * 역할 지급
 */
module.exports = (interaction, [role, parent]) => {
    const { member } = interaction;
    member.roles.add(role).then(()=>{
        interaction.reply({
            content: '역할 업데이트가 완료 되었습니다.', ephemeral: true 
        }).catch(e => { });
        if(parent) return member.roles.add(parent);
    }).catch(()=>{
        interaction.reply({
            content: '역할 업데이트가 실패 하였습니다.', ephemeral: true 
        }).catch(e => { });
    })
};
