'use strict';

const { ShardingManager } = require('discord.js');


class BasicShard extends ShardingManager{
    constructor(file, options = {}){
        super(file, {
            totalShards: 'auto',
            spawnTimeout: -1,
            respawn: true,
            ...options,
        });

        if(options.token) process.env.DISCORD_TOKEN = options.token;
    }

}
module.exports = BasicShard;