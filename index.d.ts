import {
    Client
    , ShardingManager
    , ShardingManagerOptions
    , BitFieldResolvable
    , ApplicationCommand
    , Collection
    , ClientOptions
    , MessageSelectMenuOptions
    , MessageSelectOptionData
    , MessageActionRow
    , MessageButtonOptions
    , MessageEmbed
} from  'discord.js';

declare module 'discord.js';
declare module 'discord-modals';

import {
    QueryTypes
} from 'sequelize'
//////////////////////////////////////////////////////

export const enum MessageButtonStyles {
    PRIMARY = 1,
    SECONDARY = 2,
    SUCCESS = 3,
    DANGER = 4,
    LINK = 5,
  }

//////////////////////////////////////////////////////
interface HelpCommand {
    name : string;
    description : string;
    help : string;
}

interface GetCommand {
    command : Collection;
    get(cmd): (...args : any[])=> Awaitable<void>;
    getApp(): ApplicationCommand[];
    getHelp(): HelpCommand[];
}
//////////////////////////////////////////////////////
export interface BasicClientOptions extends ClientOptions {
    eventDir? : string;
}

export interface BasicDBClientOptions extends ClientOptions {
    dbDir? : string;
}

export interface AutoShardingOptions {
    closeTimeout?: number;
    makeCache?: String;
    allowedMentions?: MessageMentionOptions;
    invalidRequestWarningInterval?: number;
    partials?: PartialTypes[];
    restWsBridgeTimeout?: number;
    restTimeOffset?: number;
    restRequestTimeout?: number;
    restGlobalRateLimit?: number;
    restSweepInterval?: number;
    retryLimit?: number;
    failIfNotExists?: boolean;
    userAgentSuffix?: string[];
    presence?: PresenceData;
    intents: BitFieldResolvable<number>;
    waitGuildTimeout?: number;
}

export interface BasicTotalGuild {
    size : number;
    users : number;
}

export interface Logger {
    log(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    debug(...args: any[]): void;
    setLevel(number : number): void;
    setName(string : string): void;
}

//////////////////////////////////////////////////////


export interface BasicCommands extends GetCommand {
    options: ApplicationCommand[];
    execute: (event: any, subcommand: string, ...args: string[]) => Awaitable<void>;
}

//////////////////////////////////////////////////////

export function LoadCommands(target: string): BasicCommands;
export function LoadSubCommands(target: string): GetCommand;

//////////////////////////////////////////////////////

class BaseClient extends Client {
    public constructor(options: BasicClientOptions);
    getTotalGuild() : BasicTotalGuild; // 길드 인원수를 가져옴
    
    public logger : Logger;
    public logger(...args: any[]) : void;
    public getMenu(data?: MessageSelectMenuOptions, ...options: MessageSelectOptionData[]): MessageActionRow[];
    public getButton( ...options: MessageButtonOptions[]): MessageActionRow[];
    public getIndexButton(length: number, index: number, ...options : MessageButtonStyles): MessageActionRow[];
    public getEmbed(): MessageEmbed;
    public defer(interaction: Interaction, target: (...args: any[]) => Awaitable<void>): void;
}

class DBClient extends BaseClient {
    public constructor(options: BasicDBClientOptions);

    public sql(type : QueryTypes, query: string, ...replacements: Object[]): Promise<any>;
    public Select(query: string, ...replacements: Object[]): Promise<any>;
    public Update(query: string, ...replacements: Object[]): Promise<any>;
    public Insert(query: string, ...replacements: Object[]): Promise<any>;
    public Delete(query: string, ...replacements: Object[]): Promise<any>;
}

export type Client = BaseClient;
export type DBClient = DBClient;


export interface AutoSharding extends ShardingManager {
    public constructor(options: ShardingManagerOptions);
    
}
