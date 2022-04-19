'use strict';
const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");

inquirer.registerPrompt('search-checkbox', require('inquirer-search-checkbox'));

const eventList = {
  "apiRequest" : [" request"]
  , "apiResponse" : [" request, response"]
  , "channelCreate" : [" channel"]
  , "channelDelete" : [" channel"]
  , "channelPinsUpdate" : [" channel, time"]
  , "channelUpdate" : [" oldChannel, newChannel"]
  , "debug" : [" info"]
  , "emojiCreate" : [" emoji"]
  , "emojiDelete" : [" emoji"]
  , "emojiUpdate" : [" oldEmoji, newEmoji"]
  , "error" : [" error"]
  , "guildBanAdd" : [" ban"]
  , "guildBanRemove" : [" ban"]
  , "guildCreate" : [" guild"]
  , "guildDelete" : [" guild"]
  , "guildIntegrationsUpdate" : [" guild"]
  , "guildMemberAdd" : [" member"]
  , "guildMemberAvailable" : [" member"]
  , "guildMemberRemove" : [" member"]
  , "guildMembersChunk" : [" members, guild, chunk"]
  , "guildMemberUpdate" : [" oldMember, newMember"]
  , "guildScheduledEventCreate" : [" guildScheduledEvent"]
  , "guildScheduledEventDelete" : [" guildScheduledEvent"]
  , "guildScheduledEventUpdate" : [" oldGuildScheduledEvent, newGuildScheduledEvent"]
  , "guildScheduledEventUserAdd" : [" guildScheduledEvent, user"]
  , "guildScheduledEventUserRemove" : [" guildScheduledEvent, user"]
  , "guildUnavailable" : [" guild"]
  , "guildUpdate" : [" oldGuild, newGuild"]
  , "interactionCreate" : [" interaction"]
  , "invalidated" : [" "] // invalidated
  , "invalidRequestWarning" : [" invalidRequestWarningData"]
  , "inviteCreate" : [" invite"]
  , "inviteDelete" : [" invite"]
  , "messageCreate" : [" message"]
  , "messageDelete" : [" message"]
  , "messageDeleteBulk" : [" message"]
  , "messageReactionAdd" : [" messageReaction, user"]
  , "messageReactionRemove" : [" messageReaction, user"]
  , "messageReactionRemoveAll" : [" message, reactions"]
  , "messageReactionRemoveEmoji" : [" reaction"]
  , "messageUpdate" : [" oldMessage, newMessage"]
  , "presenceUpdate" : [" oldPresence, newPresence"]
  , "rateLimit" : [" rateLimitData"]
  , "ready" : [" client"]
  , "roleCreate" : [" role"]
  , "roleDelete" : [" role"]
  , "roleUpdate" : [" oldRole, newRole"]
  , "shardDisconnect" : [" event, id"]
  , "shardError" : [" error, shardId"]
  , "shardReady" : [" id, unavailableGuilds"]
  , "shardReconnecting" : [" id"]
  , "shardResume" : [" id, replayedEvents"]
  , "stageInstanceCreate" : [" stageInstance"]
  , "stageInstanceDelete" : [" stageInstance"]
  , "stageInstanceUpdate" : [" oldStageInstance, newStageInstance"]
  , "stickerCreate" : [" sticker"]
  , "stickerDelete" : [" sticker"]
  , "stickerUpdate" : [" oldSticker, newSticker"]
  , "threadCreate" : [" thread"]
  , "threadDelete" : [" thread"]
  , "threadListSync" : [" threads"]
  , "threadMembersUpdate" : [" oldMembers, newMembers"]
  , "threadMemberUpdate" : [" oldMember, newMember"]
  , "threadUpdate" : [" oldThread, newThread"]
  , "typingStart" : [" typing"]
  , "userUpdate" : [" oldUser, newUser"]
  , "voiceStateUpdate" : [" oldState, newState"]
  , "warn" : [" info"]
  , "webhookUpdate" : [" channel"]
};

const baseDir = path.join(process.cwd(), "event");
const commandFolders = fs.readdirSync(baseDir).filter(file => file.endsWith('.js'));
inquirer.prompt({
  name: "events",
  message: "추가할 이벤트를 선택 해 주세요!",
  type: "search-checkbox",
  choices: Object.keys(eventList).filter(name=>!commandFolders.includes(`${name}.js`)),
}).then(({
  events
}) => {
  for (const event of events) {
    const [params, typeObject, discord_js] = eventList[event];
    fs.writeFileSync(path.join(process.cwd(), "event", `${event}.js`), `'use strict';
${discord_js || ""}
/**
* ${event}.js - 클라이언트 이벤트
*  create ${new Date()}
${params.split(",").map(param => ` * @param {${typeObject ? typeObject[param] || "*" : "*"}} ${param} `).join("\n")}
* @returns 
*/
module.exports = function ${event}(${params} ) {
const client = this;
this.logger.info(${params} );
}
    `);
  }
});