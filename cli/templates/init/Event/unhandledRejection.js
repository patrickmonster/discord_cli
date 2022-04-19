
/**
 * 오류 로깅
 *  - 해당 이벤트를 설정하면 클라이언트 오류가 발생 하여도, 종료되지 않습니다
 * @param {*} info 
 */
module.exports = function (error) {
	this.logger.error(error);
}