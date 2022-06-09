'use strict';
const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");

inquirer.registerPrompt('search-checkbox', require('inquirer-search-checkbox'));
// params, typeObject, discord_js
const options = {
    request : "{ method, path: string, route: string, options: Object, retries: number }",
    response : "Response",
    channel : "Channel",
    time : "Date",
    info : "string",
    emoji : "GuildEmoji",
    oldEmoji : "GuildEmoji",
    oldEmoji : "GuildEmoji",
    error : "Error",
    ban : "GuildBan",
    giold : "Guild",
    member : "GuildMember",
    chunk : "GuildMembersChunk",
    guildScheduledEvent : "GuildScheduledEvent",
    user : "User",
    interaction : "Interaction",
    invite : "Invite",
    message : "Message",
    reaction : "MessageReaction",
    reactions : "Collection <(string |Snowflake), MessageReaction>",
    rateLimitData : "RateLimitData",
    client : "Client",
    role : "Role",
    closeEvent : "CloseEvent",
    id : "number",
    shardId : "number",
    replayedEvents : "number",
    unavailableGuilds : "?Set<Snowflake>",
    stageInstance : "StageInstance",
    sticker	: "Sticker",
    thread	: "ThreadChannel",
    threads	: "Collection<Snowflake, ThreadChannel>",
    threadMembers	: "Collection <Snowflake, ThreadMember>",
    typing	: "Typing",
    state	: "VoiceState",
    webhookChannel	: "TextChannel or NewsChannel",
}

const eventList = {
    "apiRequest": [" request"],
    "apiResponse": [" request, response"],
    "channelCreate": [" channel"],
    "channelDelete": [" channel"],
    "channelPinsUpdate": [" channel, time"],
    "channelUpdate": [" oldChannel, newChannel"],
    "debug": [" info", `
	if (info.includes('Exceeded identify threshold')) {
		const time = info.split(' ').pop();
		this.logger.info("연결 지연중...", time);
	}
	else if (info.includes('Session Limit Information')) {
		this.logger.warn("Session Limit Information",  info.replace('[WS => Manager] Session Limit Information', ''));
	}
	else if (info.includes('[DESTORY]') || info.includes('[CONNECT]')) {
		this.logger(new Date(), info);
	}`],
    "emojiCreate": [" emoji"],
    "emojiDelete": [" emoji"],
    "emojiUpdate": [" oldEmoji, newEmoji"],
    "error": [" error"],
    "guildBanAdd": [" ban"],
    "guildBanRemove": [" ban"],
    "guildCreate": [" guild"],
    "guildDelete": [" guild"],
    "guildIntegrationsUpdate": [" guild"],
    "guildMemberAdd": [" member"],
    "guildMemberAvailable": [" member"],
    "guildMemberRemove": [" member"],
    "guildMembersChunk": [" members, guild, chunk"],
    "guildMemberUpdate": [" oldMember, newMember"],
    "guildScheduledEventCreate": [" guildScheduledEvent"],
    "guildScheduledEventDelete": [" guildScheduledEvent"],
    "guildScheduledEventUpdate": [" oldGuildScheduledEvent, newGuildScheduledEvent"],
    "guildScheduledEventUserAdd": [" guildScheduledEvent, user"],
    "guildScheduledEventUserRemove": [" guildScheduledEvent, user"],
    "guildUnavailable": [" guild"],
    "guildUpdate": [" oldGuild, newGuild"],
    "interactionCreate": [" interaction", `
    if(interaction.user.bot)return; // 봇은 검사 하지 않음
    switch(interaction.targetType){
        case "USER" : // 유저 앱 명령
        case "MESSAGE": // 메세지 앱 명령
        case "CHAT_INPUT": // 메세지 커맨드 
            this.defer(interaction,()=>{
                // 선처리 응답 후 처리
            });
            break;
        default: // 버튼 및 매뉴 이벤트
            if(interaction.isButton()){;}
            if(interaction.isCommand()) {;}
            if(interaction.isSelectMenu()){;}
            if(interaction.isModalSubmit()) {;}
    }`],
    "invalidated": [""], // invalidated
    "invalidRequestWarning": [" invalidRequestWarningData"],
    "inviteCreate": [" invite"],
    "inviteDelete": [" invite"],
    "messageCreate": [" message"],
    "messageDelete": [" message"],
    "messageDeleteBulk": [" message"],
    "messageReactionAdd": [" reaction, user"],
    "messageReactionRemove": [" reaction, user"],
    "messageReactionRemoveAll": [" message, reactions"],
    "messageReactionRemoveEmoji": [" reaction"],
    "messageUpdate": [" oldMessage, newMessage"],
    "presenceUpdate": [" oldPresence, newPresence"],
    "rateLimit": [" rateLimitData"],
    "ready": [" client", `
	this.logger.setLevel(0); // 로그레벨 {debug: 0,warn: 1,info: 2,error: 3,none: 4}
	this.logger.setName(this.user.tag); // 로그이름
    `],
    "roleCreate": [" role"],
    "roleDelete": [" role"],
    "roleUpdate": [" oldRole, newRole"],
    "shardDisconnect": [" event, id"],
    "shardError": [" error, shardId"],
    "shardReady": [" id, unavailableGuilds"],
    "shardReconnecting": [" id"],
    "shardResume": [" id, replayedEvents"],
    "stageInstanceCreate": [" stageInstance"],
    "stageInstanceDelete": [" stageInstance"],
    "stageInstanceUpdate": [" oldStageInstance, newStageInstance"],
    "stickerCreate": [" sticker"],
    "stickerDelete": [" sticker"],
    "stickerUpdate": [" oldSticker, newSticker"],
    "threadCreate": [" thread"],
    "threadDelete": [" thread"],
    "threadListSync": [" threads"],
    "threadMembersUpdate": [" oldMembers, newMembers"],
    "threadMemberUpdate": [" oldMember, newMember"],
    "threadUpdate": [" oldThreadMembers, newThreadMembers"],
    "typingStart": [" typing"],
    "userUpdate": [" oldUser, newUser"],
    "voiceStateUpdate": [" oldState, newState"],
    "warn": [" info"],
    "webhookUpdate": [" channel"],

    // "modalSubmit" : [" modal"],
};

function getType(type){
    let mType = type.replace(/^(old|new)/gi, "");
    if(!mType.length)return ""
    console.log("타입 캐스팅]", type, mType);
    mType = mType[0].toLowerCase() + mType.slice(1);
    return options[mType] || "*";
}

const baseDir = path.join(process.cwd(), "event");
!fs.existsSync(baseDir) && fs.mkdirSync(baseDir);
const commandFolders = fs.readdirSync(baseDir)
    .filter(file => file.endsWith('.js'));
inquirer
    .prompt({
        name: "events",
        message: "추가할 이벤트를 선택 해 주세요 :",
        type: "search-checkbox",
        choices: Object
            .keys(eventList)
            .filter(name => !commandFolders.includes(`${name}.js`))
    })
    .then(({events}) => {
        for (const event of events) {
            const [params, otherSorce] = eventList[event];
            const discord_js = new Set();
            const param_data = params.split(",").map( param => {
                if(param== "")return "";
                const type = getType(param.trim());
                if(!type.includes("<") && !type.includes("{") && type !="*" && !["string", "number"].includes(type)) discord_js.add(type);
                return ` * @param { ${type} } ${param} `;
            }).join("\n");

            fs.writeFileSync(
                path.join(process.cwd(), "event", `${event}.js`),`'use strict';
${discord_js.size ? `const { ${Array.from(discord_js).join(", ")} } = require('discord.js')` : ""} // 추가 라이브러리
/**
* ${event}.js - 클라이언트 이벤트
*  create ${new Date()}
${param_data}
* @returns 
*/
module.exports = function ${event}(${params} ) {
    ${otherSorce || ""}
}`);
        }
    });