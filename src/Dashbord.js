const { Permissions } = require('discord.js');
const Client = require("./Client");

const path = require('path');
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
// const swaggerDocument = require('./swagger.json');


class Dashboard extends express {
    /**
     * 
     * @param { Client } client  // ShardingManager
     * @param {*} options 
     */
    constructor(client, options) {
        super();

        // if (!(client instanceof Client) && !(client instanceof ShardingManager)) throw new Error("클라이언트 생성자가 아닙니다!");
        this.client = client;
        
        this.use(express.static(path.join(process.cwd(), "public")));
        this.use(express.json());
        this.use(express.urlencoded({ extended: false }));

        this.config = {
            baseUrl: options?.baseUrl || "http://localhost",
            port: options?.port || 3000,
            secret: options?.secret,
            permissions: options?.permissions || [Permissions.FLAGS.MANAGE_GUILD],
        };

        this.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc({
            definition: {
                openapi: '3.0.0',
                info: {
                title: 'Discord cli',
                version: '1.0.0',
                },
            },
            apis: ['./src/routes*.js'], // files containing annotations as above
        }), { explorer: true }));

        
        this.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
            res.setHeader("Access-Control-Allow-Credentials", true);

            req.client = this.client;
            req.apiEmit = (...args) => this.emit(...args);
            
            next();
        });
        
        // app.listen(8080, () => {
        //     console.log("start server 8080port");
        // });
    }
}

module.exports = Dashboard;
