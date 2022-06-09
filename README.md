# discord_cli

디스코드 앱을 조금 더 간편하게 구축 하기 위한 라이브러리

설치
```
npm i @patrickmonster/discord_cli -g
```

CLI 기능 사용
```
[npx] djs-cli
```
1) 프로젝트 생성
2) 클라이언트 이벤트 추가  
    ㄴ 이벤트 생성
3) 보조 명령 추가
    ㄴ 앱커맨드 및 슬레시 커맨드 추가
```
? 어떤 작업을 하실건가요? 
 > 프로젝트 생성
  클라이언트 이벤트 추가
  보조 명령 추가
  ──────────────
```

간편 사용을 목표로 하고 있습니다.

주요기능

빠른 디버깅 및 코딩을 위한 라이브코딩용 라이브러리 제공 

discord 메세지를 간편하게 빌드 가능한 툴
> getButton(), getMenu(), getEmbed()

내부적인 로그 규칙
> logger


빠른 클라이언트 이벤트 추가 및 주석지원
```
? 추가할 이벤트를 선택 해 주세요 : (Press <space> to select, <enter> to submit.)
 >( ) apiRequest
 ( ) apiResponse
 (*) channelCreate
 ( ) channelDelete
 ( ) channelPinsUpdate
 ( ) channelUpdate
 ( ) debug
(Move up and down to reveal more choices)
```

커맨드 명령을 손쉽게 관리
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

