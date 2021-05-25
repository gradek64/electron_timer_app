const debugging = !!process.env.DEBUG;
const chalk = require('chalk');

const debug = (text, color = 'black') =>
  debugging ? console.log(chalk[color](text)) : null;
module.exports = { debug };
