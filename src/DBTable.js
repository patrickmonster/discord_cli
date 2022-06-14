// 테이블 제작 build

const { Sequelize, DataTypes, QueryTypes } = require('sequelize');

// describeTable

class Table{

    // obejct 
    constructor(options){
        this.options = options;
    }

    addColumn(name, {
        type,
        allowNulltype,
        defaultValuetype,
        primaryKeytype,
        uniquetype,
    } = {}){
        this.columns[name] = {
            type,
            allowNulltype,
            defaultValuetype,
            primaryKeytype,
            uniquetype,
        };
        return this;
    }

    setColumn(name, {
        type,
        allowNulltype,
        defaultValuetype,
        primaryKeytype,
        uniquetype,
    } = {}){
        this.columns[name] = {
            type,
            allowNulltype,
            defaultValuetype,
            primaryKeytype,
            uniquetype,
        };
    }

    getColumn(name){
        return this.columns[name];
    }

    deleteColumn(name){
        delete this.columns[name];
    }

    createTable(dbInterface, name){
        dbInterface.createTable(name, this.options);
    }

    toJSON(){
        return JSON.stringify(this.columns);
    }
}