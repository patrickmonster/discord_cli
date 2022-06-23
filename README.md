# discord_cli
디스코드 앱을 조금 더 간편하게 구축 하기 위한 라이브러리

<p align="center"><a href="https://nodei.co/npm/@patrickmonster/discord_cli"><img src="https://nodei.co/npm/@patrickmonster/discord_cli.png.png"></a></p>
<p align="center">
  <img src="https://img.shields.io/npm/v/@patrickmonster/discord_cli">
  <img src="https://img.shields.io/npm/l/@patrickmonster/discord_cli">
</p>

## 설치
```
npm i @patrickmonster/discord_cli -g
```
 라이브러리 용도로 사용 가능하지만, cli 형태로 설치 및 사용을 권장 드립니다.


  <br><br><br>

# djs-cli
```
[npx] djs-cli
```

명령어
 - 프로젝트 생성
 - 클라이언트 이벤트 추가
 - 보조 명령 추가
 - 커맨드 명령어 등록 


---
## 프로젝트 생성
기본 설정이 이루어진 프로젝트를 생성 합니다.
(내부적으로 cli 기능이 탑제되어 있습니다.)

프로젝트 생성시 셈플 코드와, npm 필수 패키지를 자동 설치 합니다.

## 보조기능 및 라이브러리
### discord event 자동 추가

설정된 디렉토리를 통하여 disocrd 이벤트를 별도의 추가 코드 없이
추가 가능합니다.
  
  <br>

### 라이브 코딩 지원
disocrd 레이트 리밋의 한계로 인하여, 프로그램상의 오류가 발생 하였을때,
별도의 리 부트 없이 코드가 업데이트 됩니다. (LoadCommands를 통한코드 관리시)

package.json내부에 정의된 "djs-cli"를 통하여 "development"경우에 라이브 코딩을 지원 합니다.
  
  <br>

### 컴포넌트 자동정렬 지원
매뉴 및 버튼 컴포넌트를 자동으로 정렬하여,
사용자 편의성으로 지원 합니다.
```
// 역할을 가져와, 해당하는 역할만 선택처리 나머지는 선택 해제 처리 합니다.
function(client, role_id, permission_new, disabled = false) {
    const bitPermission = BigInt(permission_new);
    const permisses = Object.keys(PermissionFlagsBits)
          .filter(k => bitPermission & PermissionFlagsBits[k]);
    
    return client.getMenu({
        customId : `role permissions ${role_id}`
        , disabled
        , maxValues : 25 // 항목이 25개가 넘을 경우, 자동 처리됩니다.
        , minValues : 0
        , placeholder : `변경하실 역할을 선택 해 주세요!`
    }, ...Object.keys(PermissionFlagsLagsKR).map(k=> {
        const ment = PermissionFlagsLagsKR[k]; // 한글 역할 이름 입니다.
        return {
            default : permisses.includes( k ),
            description : k,
            label : ment,
            value : k
        };
    }))
}

```
<br><br>
## 커맨드 명령을 손쉽게 관리
```
? 어떤 작업을 하실건가요? 보조 명령 추가
? 명령이름을 입력 해 주세요 : 역할변경
? 명령타입을 설정해 주세요 : (Use arrow keys)
  ──────────────
 > 슬레시커맨드 명령
  유저입력 명령
  메세지 명령
  ──────────────
  슬레시커맨드 라우팅(하위 명령 관리용)
  명령 라우팅(하위 명령 관리용)
```
cli를 통하여, 사용자가 앱 커맨드를 쉽게 생성 가능하도록 지원 해 드립니다.

<br><br>
## 앱/ 슬레시 커맨드를 간편하게 관리
```
? 어떤 작업을 하실건가요? 명령어 등록

=================================================================
Disocrd - Commands update tool

명령을 간편하게 업데이트 하는 기능입니다.
해당 기능은, 모든 글로벌 명령을 업데이트 하기에
기존의 명령 설정이 변경 될 수 있습니다.

@patrickmonster/discord_cli 의 LoadCommands내부 기능을 통하여
명령을 불러옵니다.

해당 형식은, discord 공식 문서
[ https://discord.com/developers/docs/interactions/application-commands#application-command-object ]
를 따르고 있으며, discord.js 명령 업데이트 형식과 무관 합니다.
=================================================================

? 명령어가 있는 폴더를 선택 해 주세요(앱/슬레시커맨드) : AppCommand, Command
? 봇 토큰을 입력 해 주세요! [hidden]
```
<br><br>

---
### 변경기록

1.1.9
> DB 타입형 추가

1.1.9
> 이벤트 기본경로 문제 수정

1.1.8
> 사소한 오류 수정</br>
> cli 기본 버전 수정

1.1.8
> 업적 관리 클라이언트 추가

1.1.7
> 기존 템플릿 간소화</br>
> 로그 라이브러리 종속

1.1.6
> node 이벤트 로그 오류로 인한 정상적인 부트 불가능에 대한 오류 수정

1.1.5
> 이벤트 생성시, 폴더를 선택 가능하도록 변경

1.1.4
> 슬레시/앱커맨드 등록시, 진행중 발생하는 문제를 해결 하였습니다.

1.1.2
> 슬레시/앱커맨드 등록시, 토큰을 붙혀넣을때에 올바르게 들어가지 않는 문제를 수정하였습니다.

1.1.1
> cli 가이드 문서 [README.md]문서 개편


1.1.0
> 슬레시 커맨드 및 앱 커맨드를 등록 및 관리 cli 작성
