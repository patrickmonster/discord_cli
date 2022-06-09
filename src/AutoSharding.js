'use strict';
const { ShardingManager, ShardingManagerOptions, ClientOptions } = require('discord.js');
const Client = require('./Client');


class BaseShardingManager extends ShardingManager {
    /**
     * 
     * @param { String } file 
     * @param { ShardingManagerOptions } options 
     * @param {*} clientOption 
     */
    constructor(options, clientOption) {
        super(file, options);

        // const _this = this;
        // _this.on('shardCreate', shard => {

        // });
    }


    run(port) { // express server
        
    }
}


module.exports = function createManager(options){

}