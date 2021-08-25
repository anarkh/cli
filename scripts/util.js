const chalk = require('chalk');

const warn = (...args) => {
    console.log(chalk.yellowBright(...args));
  };
  
  const info = (...args) => {
    console.log(chalk.blueBright(...args));
  };
  
  const error = (...args) => {
    console.log(chalk.redBright(...args));
  };
  
  const success = (...args) => {
    console.log(chalk.greenBright(...args));
  };
  
  module.exports = {
    warn,
    info,
    error,
    success,
  };
  