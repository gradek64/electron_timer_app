const debugging = process.env.DEBUG
const chalk = require("chalk")

const debug = (text, value = null, color = "blue") =>
  debugging
    ? console.log(
        chalk[color](value ? `${text}:${JSON.stringify(value)}` : text)
      )
    : null
module.exports = { debug }
