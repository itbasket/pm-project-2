module.exports = {
    "rules": {
        "linebreak-style": ["error", (process.platform === "win32" ? "windows" : "unix")]
    },
    "env": {
        "browser": true,
    },
    "parser": "babel-eslint",
    "extends": "airbnb-base"
}