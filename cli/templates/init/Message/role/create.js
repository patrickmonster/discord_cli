
const path = require("path");
const name = path.basename(__filename,".js");

module.exports = {
	name,
	aliases : ['생성', '창조'],
    help : `${name} [역할명]`,
	execute(message, name, ...args) {
        const { guild, client } = message;

        guild.roles.create({ name }).then(role=>{
            message.reply(`${role} 역할이 생성 되었습니다!`);
        }).catch(e=>{
            client.logger.error(e);
            message.reply(`에러가 발생하였습니다.`);
        });
	},
};