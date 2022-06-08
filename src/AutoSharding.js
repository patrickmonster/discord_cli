'use strict';
const { ShardingManager, ShardingManagerOptions, ClientOptions } = require('discord.js');
const Client = require('./Client');


class BaseShardingManager extends ShardingManager {
    constructor(file, options) {
        super(file, options);

        // const _this = this;
        // _this.on('shardCreate', shard => {

        // });
    }


    run(port) { // express server
        
    }
}