const { MessageActionRow, MessageButton, MessageButtonOptions } = require('discord.js');
const division = require("../Util/division");

/**
 * 
 * @param  {...MessageButtonOptions} buttons 
 * @returns { [MessageActionRow] }
 */
 module.exports = (...buttons) => {
    buttons = division(buttons, 5);
    const components = [];
    for (const button of buttons){
        const actionRow = new MessageActionRow();
        actionRow.addComponents(...button.map(options => new MessageButton(options)));
        components.push(actionRow);
    }
    return components;
};
