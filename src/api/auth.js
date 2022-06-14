/**
 * 인증 - 엑세스 코드를 얻기위한 api입니다.
 * 해당 api 를 통하여 사용자 로그인을 시도 해 주세요.
 * @route GET /api/auth
 * @group foo - Operations about user
 * @returns { string } 200 - 
 * @returns {Error}  default - Unexpected error
 */

//https://discord.com/api/oauth2/authorize?client_id=826484552029175808&redirect_uri=http%3A%2F%2Flocalhost%3A3100%2Fauth%2Fdiscord&response_type=code&scope=email
module.exports = {
    get( req, res){
        res.redirect(`https://discord.com/api/oauth2/authorize?${[
            "client_id=" + req.config.discord.id,
            "redirect_uri=",
            "response_type=code",
            "scope=email",
        ].join("&")}`)
    }
}