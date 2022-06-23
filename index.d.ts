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
    , User
    , Snowflake
    , AnyChannel
    , Guild
} from  'discord.js';

declare module 'discord.js';
declare module 'discord-modals';


export { 
    TableName,
    QueryTypes, 
    QueryInterface,
    ColumnsDescription,
    DataType,
    ModelAttributeColumnOptions,
    QueryInterfaceOptions,
} from 'sequelize'
//////////////////////////////////////////////////////

// type UserList<T,N extends number> = _UserList<T, N , []>;
// type _UserList<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _UserList<T, N, [T, ...R]>;
  

enum TrueFalse {
    True = "Y",
    False = "N",
}

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

export interface Achievement {
    id? : number;
    name : string;
    description? : string;
    type? : string;
    EventType? : string;
    EventCount? : number
    isDeleted? : TrueFalse;
    parentId? : number;
}

export interface AchievementUser extends Achievement {
    id? : number;
    createAt : Date;
}
export interface AchievementBord {
    total : number;
    complet : number;
    percent : number;
    achievemen : AchievementUser[]
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

//////////////////////////////////////////////////////
function Query(type: string, query: string, ...replacements: Object[]): Promise<any>;
interface QueryObject{
    Select : Query;
    UPDATE : Query;
    INSERT : Query;
    DELETE : Query;
}

interface DBLOGTYPE {
    DEBUG_LOG  : "DEBUG_LOG",
    ERROR_LOG  :  "ERROR_LOG",
    SERVER_LOG :  "SERVER_LOG",
    DISCORD_LOG :  "DISCORD_LOG",
    DATABASE_LOG :  "DATABASE_LOG",
}

interface TableQueryInterface extends QueryInterface {
    addColumn(tableName: TableName, attributeName: string, dataTypeOrOptions?: DataType | ModelAttributeColumnOptions, options?: QueryInterfaceOptions) : Promise<void>;
    changeColumn(tableName: TableName, attributeName: string, dataTypeOrOptions?: DataType | ModelAttributeColumnOptions, options?: QueryInterfaceOptions) : Promise<void>;
    public getColumns(TableName): Promise<ColumnsDescription>;
    public getTables() : Promise<string[]>;
}

class DBClient extends BaseClient {
    public constructor(options: BasicDBClientOptions);

    public Query : Query;
    public Query : QueryObject;

    public Table : TableQueryInterface;

    public set User(user: User);
    public getUser(id : string): any;

    public updateGuildQuery(guild : Guild): void;
    public updateChannelQuery(channel : AnyChannel): void;
    public insertLog(type : string, owner : DBLOGTYPE | Snowflake, message : string): void;
}

//////////////////////////////////////////////////////

class AchievementsClient extends DBClient{
    public constructor(options: BasicClientOptions);

    public achievementComplete(user: User, id : number) : void;
    public achievementCreate(user: User, id : number) : void;
    public achievementDelete(user: User, id : number) : void;
    public achievementUpdate(user: User, id : number, isDeleted : boolean) : void;
    
    public achievement : Achievement; // 생성
    public readonly achievements : Promise<Achievement>; // 조회

    public getAchievements(user: User) : Promise<AchievementUser>;
    public getReaderBord(user: User) : Promise<AchievementBord>;
}

//////////////////////////////////////////////////////
export type Client = BaseClient;
export type DBClient = DBClient;
export type AchievementsClient = AchievementsClient;


export interface AutoSharding extends ShardingManager {
    public constructor(options: ShardingManagerOptions);
    
}
