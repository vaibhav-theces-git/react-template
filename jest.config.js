/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testTimeout: 30000,
  transform: {
    "^.+\\.(ts|tsx)?$": ["ts-jest", { diagnostics: false }],
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./src/__test__/config/importJestDOM.ts"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/__test__/mock/fileMock.ts",
    "\\.(css|less|scss)$": "<rootDir>/src/__test__/mock/styleMock.ts",
    // "^axios$": "axios/dist/node/axios.cjs",
  },
  // globals: {
  //   "ts-jest": {
  //     isolatedModules: true,
  //   },
  // },
  roots: ["<rootDir>", "./"],
  modulePaths: ["<rootDir>", "./"],
  moduleDirectories: ["node_modules"],
};