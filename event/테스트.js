'use strict';
const path = require("path");
const name = path.basename(__filename,".js");


/**
 * options
 */


/**
 * 테스트.js - 명령 이벤트
 *  create Tue Jun 14 2022 23:34:43 GMT+0900 (대한민국 표준시)
 * @param { String } name 이름
 * @param { String } description 설명
 * @param { String } type [ CHAT_INPUT : 1, USER : 2, MESSAGE : 3 ] 메세지 타입
 * @param { boolean } defaultPermission 앱이 길드에 추가될때 기본적으로 활성화 되는지 여부
 * 
 * @param { Array } options 매세지 커맨드 보조 옵션
 */
module.exports = {
    name,
    type : 1,
    dm_permissions : false,
    default_permission : true,
	description : '테스트명령에 대한 설명',
    execute(interaction) {
        // ...other sorce
    }
};