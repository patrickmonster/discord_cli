const { MessageActionRow, MessageButton, MessageButtonOptions } = require('discord.js');
const division = require("../Util/division");

/**
 * 
 * @param  {...MessageButtonOptions} buttons 
 * @returns { MessageButton }
 */
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