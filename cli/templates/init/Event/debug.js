
/**
 * 연결 디버깅
 *  세션 레이트 리밋 로깅 및  연결 상태를 디버깅 합니다.
 * @param {*} info 
 */
module.exports = function (info) {
	if (info.includes('Exceeded identify threshold')) {
		const time = info.split(' ').pop();
		this.logger.info("연결 지연중..." );
	}
	else if (info.includes('Session Limit Information')) {
		this.logger.warn("Session Limit Information",  info.replace('[WS => Manager] Session Limit Information', ''));
	}
	else if (info.includes('[DESTORY]') || info.includes('[CONNECT]')) {
		this.logger(new Date(), info);
	}
}