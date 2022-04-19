
module.exports = (interaction) =>{
    if ( interaction.user.bot ) return;
	const { customId: id, targetType } = interaction;

	switch(targetType){
		case "USER" :
		case "MESSAGE":
		case "CHAT_INPUT":
		// case "MODAL_SUBMIT":
			break;
		default: // 버튼 및 기타 이벤트
			if(interaction.isCommand()){
				
			}else{
				const [commend, ...args] = id.split(' ');
				const cmd = this.eventButton.get(commend);
				if(cmd) cmd(interaction, ...args);
			}
	}

}