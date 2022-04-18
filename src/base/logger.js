// Copyright (c) 2020 Mitchell Adair
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const levels = {
    'debug': 0,
    'warn': 1,
    'error': 2,
    'info': 3,
    'none': 4
}

let level = 'warn';
let name = 'BOT';

const formattedDate = _ => {
    const date = new Date();
    const hours = `00${date.getHours()}`.slice(-2);
    const mins = `00${date.getMinutes()}`.slice(-2);
    const seconds = `00${date.getSeconds()}`.slice(-2);
    return `${hours}:${mins}:${seconds}`;
}

const log = lvl => {
    return (...args) => {
        if (levels[lvl] >= levels[level])
            console.log(`${formattedDate()}]${name}`, ...args);
    }
}

module.exports = {
    setLevel: lvl => level = lvl,
    setName: nam => name = nam,
    debug: log('debug'),
    error: log('error'),
    warn: log('warn'),
    info: log('info'),
    log: log('none'),
}