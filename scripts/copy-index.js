/* eslint-disable */
const fs = require("fs");
const path = require("path");

console.log("Copying index.html...");

const targetFile = path.join(__dirname, "..", "build", "index.html");
console.log("Source file:", targetFile);

const destinationDir = path.join(__dirname, "../../", "src", "web", "templates");
console.log("Destination directory:", destinationDir);

if (!fs.existsSync(destinationDir)) {
  fs.mkdirSync(destinationDir, { recursive: true }); // Create directory and its parent directories if they don't exist
}

const env = process.env.npm_config_env || "development"; // Default to 'development' if no environment is provided
console.log("Environment:", env);

const destinationFile = path.join(destinationDir, `index.html`);
console.log("Destination file:", destinationFile);

fs.copyFileSync(targetFile, destinationFile);
console.log(`index.html copied successfully!`);
