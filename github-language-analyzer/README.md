# GitHub Repository Language Analyzer

## 1. Project Overview

This project is a web application designed to analyze and compare the language usage across multiple GitHub repositories. Users can input repository names, view popular repositories, and see a visual representation of the language distribution in their selected repositories.

## 2. Key Features

*   Compare language usage across multiple GitHub repositories.
*   Visualize language distribution using Chart.js.
*   Browse popular GitHub repositories.
*   View an authenticated user's own repositories.
*   Cache selected repositories for quick access.

## 3. Tech Stack

*   **Frontend**: Vanilla JavaScript, HTML, CSS (with Chart.js for data visualization)
*   **Backend**: Node.js with Express.js
*   **Data Source**: GitHub REST API (v3)
*   **Database**: SQLite (for caching popular repositories)

## 4. Project Structure

```
github-language-analyzer/
├── .env                  # Environment variables (e.g., GitHub Token)
├── githubFetcher.js      # Module for fetching data from GitHub API
├── languageAnalyzer.js   # Module for analyzing language statistics
├── package.json          # Project dependencies and scripts
├── server.js             # Express.js backend server
└── public/
    ├── index.html        # Frontend user interface
    └── pngegg.png        # Image asset
```

## 5. Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Make sure you have Node.js and npm installed.

### Installation

1.  Navigate to the project directory:
    ```bash
    cd github-language-analyzer
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Environment Variables

1.  Create a `.env` file in the `github-language-analyzer` directory.
2.  Add your GitHub Personal Access Token and GitHub Username to the `.env` file:
    ```
    GITHUB_TOKEN=your_personal_access_token
    GITHUB_USERNAME=your_github_username
    ```
    *   **Note**: Your GitHub Personal Access Token needs `repo` scope to fetch private repositories and `user` scope to fetch user repositories.

### Running the Server

Start the Express.js server:

```bash
npm start
```
The server will start on `http://localhost:3000`.

### Accessing the Application

Open `public/index.html` in your web browser to use the application.

## 6. API Endpoints

The backend provides the following API endpoints:

### `GET /api/compare`

Compares language usage across multiple GitHub repositories.

*   **Query Parameters**:
    *   `repos` (required): A comma-separated list of repositories in `owner/repo` format (e.g., `facebook/react,vuejs/vue`).

*   **Example Request**:
    ```
    GET /api/compare?repos=facebook/react,vuejs/vue
    ```

*   **Success Response (200)**:
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

*   **Error Responses**:
    *   `400 Bad Request`: Missing `repos` parameter or no valid repositories found.
    *   `500 Internal Server Error`: Server error or GitHub API call failure.

### `GET /api/popular-repos`

Fetches a list of popular GitHub repositories.

*   **Query Parameters**:
    *   `limit` (optional): The number of popular repositories to return (default: 10).

*   **Example Request**:
    ```
    GET /api/popular-repos?limit=50
    ```

*   **Success Response (200)**:
    ```json
    [
      "owner1/repo1",
      "owner2/repo2",
      // ...
    ]
    ```

### `GET /api/my-repos`

Fetches a list of repositories for the authenticated GitHub user (based on `GITHUB_USERNAME` in `.env`).

*   **Example Request**:
    ```
    GET /api/my-repos
    ```

*   **Success Response (200)**:
    ```json
    [
      "myuser/myrepo1",
      "myuser/myrepo2",
      // ...
    ]
    ```
