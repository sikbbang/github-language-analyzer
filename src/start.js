import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const nodeModulesPath = path.resolve(__dirname, "node_modules");

// node_modules 없으면 설치 (로컬에서만 의미)
if (!fs.existsSync(nodeModulesPath)) {
  console.log("Installing dependencies in src...");
  spawnSync("npm", ["install"], { stdio: "inherit", cwd: __dirname });
} else {
  console.log("Dependencies already installed, skipping install.");
}

// 서버 실행
console.log("Starting server...");
spawnSync("npm", ["start"], { stdio: "inherit", cwd: __dirname });