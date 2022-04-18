const { MessageActionRow, MessageButton, MessageButtonStyles } = require('discord.js');
const division = require("../Util/division");

const page = "1️⃣,2️⃣,3️⃣,4️⃣,5️⃣,6️⃣,7️⃣,8️⃣,9️⃣,🔟".split(",");
const size = 50;

/**
 * 매뉴 생성기
 * @param { number } length 페이징 0~25 
 * @param { number } index  선택시킬번지 0~length
 * @param { MessageButtonStyles } options  선택시킬번지 0~length
 * @returns { MessageActionRow[] }
 */
 module.exports = function getIndexButton(length, index, options){
	const components = [];
	if(length > 25)length = 25;
	if(index > length)index = 0;
	let actionRow = new MessageActionRow();
	for (const i in Array.from({length})){
		if(i % 5 == 0 && actionRow.components.length){
			components.push(actionRow);
			actionRow = new MessageActionRow();
		}
		actionRow.addComponents(
			new MessageButton({
				style: options || 'PRIMARY',
				customId: `${customId} ${i}`,
				disabled : parseInt(index) == i,
				emoji: { name: page[i] || "️*️⃣" },
			})
		)
	}
	if(actionRow.components.length)
		components.push(actionRow);
	return components;
}