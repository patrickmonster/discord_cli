const { Permissions } = require('discord.js');
const Dashbord = require("./Dashbord");
const Sequelize = require('sequelize');

const path = require('path');



class DBDashboard extends Dashbord {
    constructor(client, options, config = {}){
        
        const sequelize = new Sequelize({
            
            config.database,
            config.username,
            config.password,
            config,
        })
        
    }
}

module.exports = DBDashboard;