# GitHub 저장소 언어 분석기

## 1. 프로젝트 개요

이 프로젝트는 여러 GitHub 저장소의 언어 사용량을 분석하고 비교하기 위해 설계된 웹 애플리케이션입니다. 사용자는 저장소 이름을 입력하고, 인기 있는 저장소를 확인하며, 선택한 저장소의 언어 분포를 시각적으로 볼 수 있습니다.

## 2. 주요 기능

*   여러 GitHub 저장소의 언어 사용량 비교.
*   Chart.js를 사용한 언어 분포 시각화.
*   인기 있는 GitHub 저장소 탐색.
*   인증된 사용자의 개인 저장소 보기.
*   빠른 접근을 위해 선택한 저장소 캐싱.

## 3. 기술 스택

*   **프런트엔드**: Vanilla JavaScript, HTML, CSS (데이터 시각화를 위한 Chart.js 포함)
*   **백엔드**: Node.js (Express.js 사용)
*   **데이터 소스**: GitHub REST API (v3)
*   **데이터베이스**: SQLite (인기 저장소 캐싱용)

## 4. 프로젝트 구조

```
github-language-analyzer/
├── .env                  # 환경 변수 (예: GitHub 토큰)
├── githubFetcher.js      # GitHub API에서 데이터를 가져오는 모듈
├── languageAnalyzer.js   # 언어 통계를 분석하는 모듈
├── package.json          # 프로젝트 의존성 및 스크립트
├── server.js             # Express.js 백엔드 서버
└── public/
    ├── index.html        # 프런트엔드 사용자 인터페이스
    └── pngegg.png        # 이미지 자산
```

## 5. 시작하기

프로젝트를 로컬에서 설정하고 실행하려면 다음 단계를 따르세요.

### 전제 조건

Node.js 및 npm이 설치되어 있는지 확인하세요.

### 설치

1.  프로젝트 디렉토리로 이동합니다:
    ```bash
    cd github-language-analyzer
    ```
2.  의존성을 설치합니다:
    ```bash
    npm install
    ```

### 환경 변수

1.  `github-language-analyzer` 디렉토리에 `.env` 파일을 생성합니다.
2.  `.env` 파일에 GitHub 개인 액세스 토큰과 GitHub 사용자 이름을 추가합니다:
    ```
    GITHUB_TOKEN=your_personal_access_token
    GITHUB_USERNAME=your_github_username
    ```
    *   **참고**: GitHub 개인 액세스 토큰은 비공개 저장소를 가져오려면 `repo` 범위가, 사용자 저장소를 가져오려면 `user` 범위가 필요합니다.

### 서버 실행

Express.js 서버를 시작합니다:

```bash
npm start
```
서버는 `http://localhost:3000`에서 시작됩니다.

### 애플리케이션 접근

웹 브라우저에서 `public/index.html` 파일을 열어 애플리케이션을 사용하세요.

## 6. API 엔드포인트

백엔드는 다음 API 엔드포인트를 제공합니다:

### `GET /api/compare`

여러 GitHub 저장소의 언어 사용량을 비교합니다.

*   **쿼리 파라미터**: 
    *   `repos` (필수): `owner/repo` 형식의 쉼표로 구분된 저장소 목록 (예: `facebook/react,vuejs/vue`).

*   **요청 예시**:
    ```
    GET /api/compare?repos=facebook/react,vuejs/vue
    ```

*   **성공 응답 (200)**:
    ```json
    {
      "JavaScript": {
        "bytes": 123456,
        "percentage": 75.8
      },
      "CSS": {
        "bytes": 39876,
        "percentage": 24.2
      }
    }
    ```

*   **오류 응답**:
    *   `400 Bad Request`: `repos` 파라미터가 없거나 유효한 저장소를 찾을 수 없는 경우.
    *   `500 Internal Server Error`: 서버 오류 또는 GitHub API 호출 실패.

### `GET /api/popular-repos`

인기 있는 GitHub 저장소 목록을 가져옵니다.

*   **쿼리 파라미터**:
    *   `limit` (선택 사항): 반환할 인기 저장소의 수 (기본값: 10).

*   **요청 예시**:
    ```
    GET /api/popular-repos?limit=50
    ```

*   **성공 응답 (200)**:
    ```json
    [
      "owner1/repo1",
      "owner2/repo2",
      // ...
    ]
    ```

### `GET /api/my-repos`

인증된 GitHub 사용자(`.env`의 `GITHUB_USERNAME` 기준)의 저장소 목록을 가져옵니다.

*   **요청 예시**:
    ```
    GET /api/my-repos
    ```

*   **성공 응답 (200)**:
    ```json
    [
      "myuser/myrepo1",
      "myuser/myrepo2",
      // ...
    ]
    ```