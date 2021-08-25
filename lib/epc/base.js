const ESlintConfig = require('./eslint');
const CI = require('./ci');
const Jest = require('./jest');
const main = async () => {
  const eslint = new ESlintConfig();
  const ci = new CI();
  const jest = new Jest();
  eslint.init();
  await ci.init();
  jest.init();
};
module.exports = main;
