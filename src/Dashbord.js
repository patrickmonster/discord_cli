const { Permissions } = require('discord.js');
const Client = require("./Client");

const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const { generateSpecAndMount } = require('./Util/swagger');
const { open } = require('sqlite')
const sqlite3 = require('sqlite3')

const expressSwagger = generateSpecAndMount(app);


const getFiles = (dir) => 
    fs.readdirSync(path.join(__dirname, dir))
        .filter((file) => file.indexOf('.') !== 0 && file.slice(-3) === '.js')
        .map(f => path.join(dir, f));

const auth = (req, res, next) => {
    req.db.get("SELECT * FROM user WHERE token = ?", req.body.token || "").then(([user])=>{
        req.user = user;
        next(user);
    }).catch(e=>{
        res.json({ error: e });
    })
}

module.exports = async function (client, options) {

    // if (!(client instanceof Client) && !(client instanceof ShardingManager)) throw new Error("클라이언트 생성자가 아닙니다!");
    app.client = client;
    
    app.use(express.static(path.join(process.cwd(), "public")));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.config = {
        baseUrl: options?.baseUrl || "http://localhost",
        port: options?.port || 3000,
        discord : {
            id : "",
            secret : "",
            ...options.discord,
        },
        basePath: options?.basePath || '/v1',
        swagger: [], // base path
        db : {
            file : path.join(process.cwd(), "db", "log.db"), // 데이터베이스
            error : console.error,
            debug : console.info,
            ...options.db,
        },
        permissions: options?.permissions || [Permissions.FLAGS.MANAGE_GUILD],
    };
    
    const apis =  (await getFiles("./api")).map(p => path.join(__dirname, p));

    expressSwagger({
        swaggerDefinition: {
            info: {
                description:  options.description || 'This is a sample server',
                title: options.title || 'Swagger',
                version: options.version || '1.0.0',
            },
            host: `localhost:${app.config.port}`,
            basePath: options.basePath || '/v1',
            produces: [
                "application/json",
                "application/xml"
            ],
            schemes: ['http', 'https'],
            securityDefinitions: {
                JWT: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    description: "",
                }
            }
        },
        files: [
            apis,
            ...app.config.swagger
        ] //Path to the API handle folder
    });


    // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc({
    //     definition: {
    //         openapi: '3.0.0',
    //         info: {
    //         title: 'Discord cli',
    //         version: '1.0.0',
    //         },
    //     },
    //     apis: ['./src/routes*.js'], // files containing annotations as above
    // }), { explorer: true }));

    
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
        res.setHeader("Access-Control-Allow-Credentials", true);

        req.client = app.client;
        req.config = app.config;
        req.apiEmit = (...args) => app.emit(...args);
        req.db = () =>{
            const db = open({
                filename : app.config.db,          
                driver : sqlite3.cached.Database
            });
            db.on('trace', app.config.db.error);
            db.on('profile', app.config.db.debug);
            return db;
        }
        
        next();
    });

    const db = open({
        filename : app.config.db.file,          
        driver : sqlite3.cached.Database
    });

    app.run = callback => {
        app.listen(app.config.port, callback);
    };

    return app
}

module.exports.auth = auth;