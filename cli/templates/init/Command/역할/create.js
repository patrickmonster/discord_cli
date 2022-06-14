'use strict';

const path = require("path");
const name = path.basename(__filename,".js");

module.exports = {
	name,
	aliases : ['생성', '창조'],
    help : `${name} [역할명]`,
	execute(message, name, ...args) {
        const { guild, client } = message;

        guild.roles.create({ name }).then(role=>{
            message.reply({
                content: `${role} 역할이 생성 되었습니다!`,
                componets : client.getButton({
                    customId : `role ${role.id}`,
                    disabled : false,
                    emoji :  { name : "❤"},
                    style : `SUCCESS`, // [PRIMARY, SECONDARY, SUCCESS, DANGER, LINK]
                    label : `역할을 부여합니다.`
                })
            });
        }).catch(e=>{
            client.logger.error(e);
            message.reply(`문제가 발생하였습니다.`);
        });
	},
};