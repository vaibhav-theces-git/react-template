/* eslint-disable */
const fs = require("fs-extra");
const path = require("path");

console.log("Copying static files...");

const env = process.env.npm_config_env || "development"; // Default to 'development' if no environment is provided
console.log("Environment:", env);

const sourceDir = path.join(__dirname, "..", "build", "static");
console.log("Source directory:", sourceDir);

const destinationDir = path.join(__dirname, "../../", "src", "web", "static");
console.log("Destination directory:", destinationDir);

fs.ensureDirSync(destinationDir); // Create directory and its parent directories if they don't exist

fs.emptyDirSync(destinationDir);
fs.copySync(sourceDir, destinationDir);
console.log(`Static files copied to ${destinationDir} successfully!`);
