
module.exports = function(interaction, target) {
    interaction.deferReply({fetchReply : false, ephemeral: true}).then(()=>{
        target(interaction);
    }).catch(_=>{
        interaction.client._l('err',`Error to Interaction timming ${interaction.targetType}`);
    }); // 응답실패
}