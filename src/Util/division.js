'use strict';
module.exports = function division(l, n){
	const arr = l;
	const len = arr.length;
	const cnt = Math.floor(len / n);
	const tmp = [];

	for (let i = 0; i <= cnt; i++) {
		tmp.push(arr.splice(0, n));
	}

	return tmp;
}