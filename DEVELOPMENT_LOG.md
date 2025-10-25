# 개발 일지  
## 프로젝트 개요 
- 프로젝트명:n
- 개발 기간:n
- 목표:n
 ## 개발 과정  
 ### Week 1 (날짜) 
 #### Day 1 - 프로젝트 기획 
 - **작업 내용**: n
 - **Gemini CLI 사용 프롬프트**:
    - gemini 설치
        ```
        $npm install -g @google/gemini-cli

        added 576 packages in 46s
        148 packages are looking for funding
        run `npm fund` for details
        ```
    - gemini 로그인
        ```
        $gemini
        ```
    - 프로젝트 초기설정
        ```
        gemini 'Node.js에서 GitHub API를 호출해 특정 유저/저장소의 언어별 바이트 수를 가져오는 비동기 함수를 작성해 줘. axios를 사용하고, GitHub 토큰은 환경 변수 `GITHUB_TOKEN`에서 읽어오도록 처리해.' > githubFetcher.js

        ✦ 요청하신 githubFetcher.js 파일을 /home/ubuntu/web/ 디렉토리에 생성했습니다. axios와 dotenv 라이브러리가 필요하며, .env 파일에 GITHUB_TOKEN이 설정되어 있어야 합니다.



        gemini '두 개 이상의 GitHub 언어 데이터 객체(언어: 바이트 수)를 입력으로 받아, 각 언어의 전체 사용률을 퍼센트로 계산하고 비교 가능한 JSON 형식으로 반환하는 JavaScript 함수를 작성해 줘.' > languageAnalyzer.js

        ✦ 알겠습니다. languageAnalyzer.js 파일을 생성하고, 여러 GitHub 언어 데이터 객체를 분석하여 언어별 사용률을 계산하는 JavaScript 함수를 작성하겠습니다. 파일은 이전과 같이 /home/ubuntu/web/ 디렉토리에 생성됩니다.
        ✦ 요청하신 languageAnalyzer.js 파일을 /home/ubuntu/web/ 디렉토리에 생성했습니다. 이 함수는 언어 데이터 객체 배열을 입력으로 받아 전체 언어 사용률을 계산합니다.



        gemini 'Express를 사용하여 `/api/compare` 엔드포인트를 만들고, GET 요청이 들어오면 `githubFetcher` 함수와 `languageAnalyzer` 함수를 사용하여 저장소 비교 결과를 JSON으로 
        응답하는 Node.js 서버 코드를 작성해 줘.' > server.js

        ✦ 네, 알겠습니다. server.js 파일을 생성하고, Express를 사용하여 /api/compare 엔드포인트를 구현하는 Node.js 서버 코드를 작성하겠습니다. 이 코드는 githubFetcher.js와 languageAnalyzer.js의 함수를 사용하여 저장소 언어 데이터를 가져오고 분석한 후, 결과를 JSON으로 응답합니다. 파일은 /home/ubuntu/web/에 생성됩니다.
        ✦ 요청하신 server.js 파일을 /home/ubuntu/web/ 디렉토리에 생성했습니다. 이 서버는 /api/compare 엔드포인트를 통해 GitHub 저장소 언어 사용률을 비교하는 API를 제공합니다. 서버를 실행하려면 express와 cors라이브러리를 설치해야 합니다.



        gemini 'Node.js 서버의 `/api/compare` 엔드포인트에서 데이터를 fetch하고, 그 결과를 Chart.js 라이브러리를 사용해서 언어 사용률 파이 차트로 시각화하는 Vanilla.js와 HTML 코드를 작성해 줘.' > index.html

        ✦ 알겠습니다. index.html 파일을 생성하고, 사용자가 GitHub 저장소 목록을 입력하면 서버의 /api/compare 엔드포인트에서 데이터를 가져와 Chart.js를 사용하여 언어 사용률 파이 차트를 그리는 Vanilla JavaScript와 HTML 코드를 작성하겠습니다. 파일은 /home/ubuntu/web/에 생성됩니다.
        ✦ 요청하신 index.html 파일을 /home/ubuntu/web/ 디렉토리에 생성했습니다. 이것으로 기본적인 웹 애플리케이션 골격이 완성되었습니다.



        요청을 통해 생성된 파일들 (githubFetcher.js, languageAnalyzer.js, server.js, index.html)을 하나의 프로젝트 폴더에 모으고 필요한 패키지 설치해

        ✦ 알겠습니다. 요청에 따라 생성된 파일들을 github-language-analyzer라는 새 프로젝트 폴더로 옮기고, 필요한 패키지를 설치하겠습니다.
        먼저 프로젝트 폴더와 그 안에 public 폴더를 생성하겠습니다.
        파일 이동이 완료되었습니다. 이제 server.js가 정적 파일을 제공하도록 코드를 수정하겠습니다. 먼저 server.js 파일을 읽어오겠습니다.
        ✦ server.js 파일을 읽었습니다. 이제 app.use(express.json()); 바로 뒤에 app.use(express.static('public')); 코드를 추가하여 정적 파일을 제공하도록 하겠습니다. replace 도구를 사용하겠습니다.
        ✦ server.js 업데이트가 끝났습니다. 이제 npm 프로젝트를 초기화하고 의존성을 설치하겠습니다. npm init -y와 npm install express cors dotenv axios를 /home/ubuntu/web/github-language-analyzer 디렉토리에서 실행합니다.
        ✦ 프로젝트 폴더를 생성하고 파일들을 정리했습니다. 또한, 필요한 모든 패키지를 설치했습니다.

        ```