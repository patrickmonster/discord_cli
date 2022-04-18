const { MessageActionRow, MessageButton } = require('discord.js');
const division = require("../Util/division");

module.exports = function(...buttons) {
    buttons = division(buttons, 5);
    const components = [];
    for (const button of buttons){
        const actionRow = new MessageActionRow();
        for(const i of button)
            actionRow.addComponents( new MessageButton(i) )
        components.push( actionRow );
    }
    return components;
}