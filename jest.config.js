/* eslint-env node */
module.exports = {
  testEnvironment: "node",
  modulePaths: ["node_modules", "src", "test", "."],
  testMatch: ["**/?(*.)test.+(ts)"],
  reporters: ["default", "jest-junit"],
  transform: {"^.+\\.(ts)$": "ts-jest"},
  moduleNameMapper: {
    "^.+\\.(css|scss)$": "<rootDir>/../../node_modules/jest-css-modules",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/fileMocks.js"
  }
}
