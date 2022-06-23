import {
    Client as BaseClient
    , ShardingManager
    , ShardingManagerOptions
    , ApplicationCommandData
    , Collection
    , ClientOptions
    , Interaction
    , MessageSelectMenuOptions
    , MessageSelectOptionData
    , MessageActionRow
    , MessageButtonOptions
    , MessageEmbed
    , Message
    , User
    , Snowflake
    , AnyChannel
    , Guild
    , Awaitable
} from  'discord.js';

declare module 'discord.js';
declare module 'discord-modals';


export { 
    Sequelize,
    TableName,
    QueryTypes, 
    QueryInterface,
    ColumnsDescription,
    DataType,
    ModelAttributeColumnOptions,
    QueryInterfaceOptions,
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
    command : Collection<Snowflake, ApplicationCommandData>;
    
    get(cmd): (...args : any[])=> Awaitable<void>;
    add(fileName : string) : void; // 파일 추가 (탐색 폴더내 추가된 파일)
    execute(interaction : Interaction | Message) : void;
    forEach(callback : (v : any, k : string, cmds :  ApplicationCommandData[]) => k[]): void;
    getHelp(): HelpCommand[];
    getCommands(): ApplicationCommandData[];
}
//////////////////////////////////////////////////////
export interface BasicClientOptions extends ClientOptions {
    eventDir? : string;
}

export interface BasicDBClientOptions extends ClientOptions {
    dbDir? : string;
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

export function LoadCommands(target: string): GetCommand;

//////////////////////////////////////////////////////

enum TrueFalse {
    True = "Y",
    False = "N",
}

export class Client extends BaseClient {
    public constructor(options: BasicClientOptions);
    getTotalGuild() : BasicTotalGuild; // 길드 인원수를 가져옴
    
    // public logger : Logger;
    // public logger(...args: any[]) : void;
    public getMenu(data?: MessageSelectMenuOptions, ...options: MessageSelectOptionData[]): MessageActionRow[];
    public getButton( ...options: MessageButtonOptions[]): MessageActionRow[];
    public getIndexButton(length: number, index: number, ...options : MessageButtonStyles): MessageActionRow[];
    public getEmbed(): MessageEmbed;
    public defer(interaction: Interaction, target: (...args: any[]) => Awaitable<void>): void;
}

//////////////////////////////////////////////////////
function Query(type: string, query: string, ...replacements: Object[]): Promise<any>;

function SubQuery(query: string, ...replacements: Object[]): Promise<any>

class QueryObject{
    public Select : typeof SubQuery;
    public UPDATE : typeof SubQuery;
    public INSERT : typeof SubQuery;
    public DELETE : typeof SubQuery;
}

interface DBLOGTYPE {
    DEBUG_LOG  : "DEBUG_LOG",
    ERROR_LOG  :  "ERROR_LOG",
    SERVER_LOG :  "SERVER_LOG",
    DISCORD_LOG :  "DISCORD_LOG",
    DATABASE_LOG :  "DATABASE_LOG",
}

class TableQueryInterface extends QueryInterface {
    constructor(sequelize: Sequelize);
    addColumn(tableName: typeof TableName, attributeName: string, dataTypeOrOptions?: DataType | ModelAttributeColumnOptions, options?: QueryInterfaceOptions) : Promise<void>;
    changeColumn(tableName: TableName, attributeName: string, dataTypeOrOptions?: DataType | ModelAttributeColumnOptions, options?: QueryInterfaceOptions) : Promise<void>;
    public getColumns(TableName): Promise<ColumnsDescription>;
    public getTables() : Promise<string[]>;
}

export class DBClient extends BaseClient {
    public constructor(options: BasicDBClientOptions);

    public Query : typeof Query | QueryObject;
    public Table : TableQueryInterface;

    public set User(user: User);
    public getUser(id : string): any;

    public updateGuildQuery(guild : Guild): void;
    public updateChannelQuery(channel : AnyChannel): void;
    public insertLog(type : string, owner : DBLOGTYPE | Snowflake, message : string): void;
}

//////////////////////////////////////////////////////

export class AchievementsClient extends DBClient{
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

export interface AutoSharding extends ShardingManager {
    public constructor(options: ShardingManagerOptions);
    
}
