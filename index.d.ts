import {
    Client
    , ApplicationCommand
    , Collection
    , ClientOptions
    , MessageSelectMenuOptions
    , MessageSelectOptionData
    , MessageActionRow
    , MessageButton
    , MessageButtonOptions
    , MessageEmbed
} from  'discord.js';
import {
  APIButtonComponent,
} from 'discord-api-types/v9';


declare module "discord.js";
declare module "discord-modals";
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

export class BasicClient extends Client {
    public constructor(options: BasicClientOptions);
    getTotalGuild() : BasicTotalGuild; // 길드 인원수를 가져옴
    
    public logger : Logger;
    public logger(...args: any[]) : void;
    public getMenu(data?: MessageSelectMenuOptions, ...options: MessageSelectOptionData[] | MessageSelectOptionData[][]): MessageActionRow;
    public getIndexButton(length: number, index: number, ...options : MessageButtonStyles): MessageActionRow;
    public getIndexButton(data?: MessageButton | MessageButtonOptions | APIButtonComponent): MessageActionRow;
    public getEmbed(): MessageEmbed;
    public defer(interaction: Interaction, target: (...args: any[]) => Awaitable<void>): void;
}

export function CommandManager(token: string, ...dirs : string[]): void;
