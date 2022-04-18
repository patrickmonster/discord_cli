const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const division = require("../Util/division");

module.exports = function({
    customId, disabled, maxValues, minValues, placeholder
}, ...options) {
    options = division(options, 25);
    const actionRow = new MessageActionRow();
    for (const i in options){
        actionRow.addComponents(
            new MessageSelectMenu({
                customId : `${customId} ${i}`
                , disabled
                , maxValues
                , minValues
                , placeholder
            }).addOptions(...options[i])
        );
    }
    return actionRow;
}