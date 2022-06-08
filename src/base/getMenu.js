const { MessageActionRow, MessageSelectMenu, 
    MessageSelectMenuOptions,
    APISelectMenuComponent,
    MessageSelectOptionData,
} = require('discord.js');
const division = require("../Util/division");

/**
 * 
 * @param { MessageSelectMenu | MessageSelectMenuOptions | APISelectMenuComponent} param0 
 * @param  { MessageSelectOptionData[]} options 
 * @returns { MessageActionRow }
 */
 module.exports = ({
    customId, disabled, maxValues, minValues, placeholder
}, ...options) => {
    options = division(options, 25);    
    const components = [];
    for (const i in options){
        components.push(new MessageActionRow().addComponents(
            new MessageSelectMenu({
                customId : `${customId} ${i}`
                , disabled
                , maxValues : maxValues > options[i].length ? options[i].length : maxValues 
                , minValues
                , placeholder // 기본 설명
            }).addOptions(...options[i])
        ))
    }
    return components;
};