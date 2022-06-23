/**
 * DB 설계 에디터
 */

 const { Sequelize, DataTypes } = require('sequelize');

module.exports = {
    id : {
        type : DataTypes.CHAR(20),
        primaryKey : true,
        allowNull : false
    },
    idx : { // 고유 ID
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true,
    },
    Snowflake : { type : DataTypes.CHAR(20), },
    createAt  : {
        type : DataTypes.DATE,
        defaultValue : Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    Bool : {
        type : DataTypes.CHAR(1),
        defaultValue : 'N',
        allowNull : false
    },
    INTEGER : DataTypes.INTEGER,
    TEXT : DataTypes.TEXT(65535),
    CHAR : (size, defaultValue = null)=>({ type : DataTypes.CHAR(size), defaultValue }),
}