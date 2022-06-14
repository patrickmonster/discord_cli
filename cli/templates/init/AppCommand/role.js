'use strict';

const path = require("path");
const name = path.basename(__filename,".js");

/**
 * 소유하고 있는 역할 리스트를 출력합니다.
 * @param { String } name 이름
 * @param { String } description 설명
 * @param { String } type [ CHAT_INPUT, USER, MESSAGE ] 메세지 타입
 * @param { String } channelTypes [GUILD_TEXT, DM] 채널 타입
 * @param { boolean } defaultPermission 앱이 길드에 추가될때 기본적으로 활성화 되는지 여부
 */
 module.exports = {
	name,
	type : 2, // [chat input, user, message]
	default_permission : true,
	dm_permissions : true,
	execute(interaction) {
        const { targetId, client, guild : { members, roles } } = interaction;

        
        const member = members.cache.get(targetId);
        if(member){
            interaction.reply({
                content : "해당 맴버가 소유하고 있는 역할들 입니다.",
                components : client.getMenu({
                    customId : `${process.env.discriminator}role permissions ${role_id}`
                    , disabled
                    , maxValues : 25
                    , minValues : 0
                    , placeholder : `변경하실 역할을 선택 해 주세요!`
                }, ...roles.cache.map((role) => {
                    const { id, name, hexColor, members} = role;
                    return {
                        default : member.roles.cache.has(id),
                        description : `${hexColor} - ${members.size}명이 같은 역할을 부여 받았습니다.`,
                        label : `${name}`,
                        value : `${id}`
                    };
                }))
            })
        }else{
            interaction.reply({
                content : "해당 맴버를 찾을 수 없습니다!"
            })
        }

    }
}