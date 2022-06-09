const { ShardingManager } = require('discord.js');
const Client = require("./Client");

const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


class Dashboard extends express {
    /**
     * 
     * @param { Client } client  // ShardingManager
     * @param {*} options 
     */
    constructor(client, options) {
        super();

        if (!(client instanceof Client) && !(client instanceof ShardingManager)) throw new Error("클라이언트 생성자가 아닙니다!");
        this.client = client;
        
        this.use(express.static(join(__dirname, "public")));
        this.use(express.json());
        this.use(express.urlencoded({ extended: false }));

        this.config = {
            baseUrl: options?.baseUrl || "http://localhost",
            port: options?.port || 3000,
            secret: options?.secret,
            injectCSS: options?.injectCSS || null,
            theme: this._getTheme(options?.theme),
            permissions: options?.permissions || [Permissions.FLAGS.MANAGE_GUILD],
        };

        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        
        this.app.use((req, res, next) => {
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
