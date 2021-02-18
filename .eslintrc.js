module.exports = {
    "rules": {
        "linebreak-style": ["error", (process.platform === "win32" ? "windows" : "unix")]
    },
    "parser": "babel-eslint",
    "extends": "airbnb-base"
}