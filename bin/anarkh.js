#!/usr/bin/env node
const yargs = require('yargs');
const { greenBright, blueBright, yellowBright } = require('chalk');
const { version } = require('../package.json');
const epc = require('../lib/epc/base');
const command = 'anarkh';
const helpInfo = [
  [command, '-v', '显示版本号'],
  [command, '--version', '显示版本号'],
  [command, '-h', '显示帮助信息'],
  [command, '--help', '显示帮助信息'],
  [command, 'init', '初始化项目'],
];

const printHelp = () => {
  console.log('anarkh-cli: powered by anarkh lee');
  console.log('version:', yellowBright(version));
  helpInfo.forEach((item) => {
    if (item[0] !== command) {
      item[0] = blueBright(item[0]);
      item.unshift(' '.repeat(command.length));
      console.log(...item);
      return;
    }
    item[0] = greenBright(item[0]);
    console.log();
    console.log(...item);
  });
};

const { argv } = yargs.usage('anarkh <cmd> [args]')
  .command({
    command: 'init',
    desc: '初始化项目',
    handler: () => {
      console.log('---------');
      epc();
    },
  })

if (argv.v || argv.version) {
  console.log(version);
}

if (argv.h || argv.help || argv._.length === 0) {
  printHelp();
}
