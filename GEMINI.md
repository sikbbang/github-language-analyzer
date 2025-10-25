# GitHub Repository Language Analyzer

## 1. 프로젝트 개요 및 기술 스택

| 항목 | 내용 | 비고 |
| --- | --- | --- |
| 프로젝트명 | GitHub Repository Language Analyzer | |
| 목표 | 개인 및 전체 GitHub 저장소 언어/프레임워크 사용 현황 비교 분석 웹 애플리케이션 | |
| 핵심 기능 | GitHub 저장소 언어 사용률 비교 및 데이터 시각화 | |
| Frontend | Vanilla JavaScript + HTML | 클라이언트 로직 및 Chart.js를 이용한 시각화 |
| Backend | Node.js + Express | GitHub API 프록시 및 데이터 분석 |
| 데이터 소스 | GitHub REST API (v3) | `githubFetcher.js`를 통해 데이터 호출 |
| 데이터 시각화 | Chart.js | `index.html`에서 파이 차트로 언어 분포 시각화 |

## 2. 프로젝트 구조

- `index.html`: 사용자가 저장소를 입력하고 결과를 차트로 확인할 수 있는 기본 UI입니다.
- `server.js`: `/api/compare` 엔드포인트를 제공하는 Express 서버입니다.
- `githubFetcher.js`: GitHub API에서 저장소 언어 데이터를 가져오는 모듈입니다.
- `languageAnalyzer.js`: 여러 저장소의 언어 데이터를 취합하고 비율을 계산하는 모듈입니다.
- `.env`: GitHub API 토큰을 저장하는 환경 변수 파일입니다.

## 3. 실행 방법

1.  **의존성 설치:**
    ```bash
    npm install express cors dotenv axios
    ```

2.  **환경 변수 설정:**
    프로젝트 루트에 `.env` 파일을 생성하고 GitHub 개인 액세스 토큰을 추가하세요.
    ```
    GITHUB_TOKEN=your_personal_access_token
    ```

3.  **서버 실행:**
    ```bash
    node server.js
    ```
    서버가 3000번 포트에서 실행됩니다.

4.  **애플리케이션 사용:**
    웹 브라우저에서 `index.html` 파일을 열어주세요.

## 4. API 엔드포인트

### GET /api/compare

여러 GitHub 저장소의 언어 사용률을 비교하여 결과를 반환합니다.

- **Query Parameters:**
    - `repos` (required): 쉼표(`,`)로 구분된 저장소 목록. (형식: `owner/repo`)
- **Example Request:**
    `/api/compare?repos=facebook/react,vuejs/vue`
- **Success Response (200):**
    - **Content:** 각 언어의 총 바이트 수와 전체에서 차지하는 비율(%)을 담은 JSON 객체.
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
- **Error Responses:**
    - `400 Bad Request`: `repos` 쿼리 파라미터가 없거나 유효한 저장소를 찾지 못한 경우.
    - `500 Internal Server Error`: 서버 내부 오류 또는 GitHub API 호출에 실패한 경우.