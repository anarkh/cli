const { checkFile, getConfFilePath, copyDir, getTargetPath, getPackage, addPackage, copyFile } = require('../util');
const { readFileSync, writeFileSync } = require('fs');
const { prompt } = require('enquirer');
const YAML = require('yaml');
class CI {
  constructor() {
    const { devDependencies } = getPackage({
      devDependencies: [
        'husky',
        'lint-staged',
        'conventional-changelog',
        'conventional-changelog-cli',
        '@commitlint/cli',
        '@commitlint/config-conventional',
      ]
    });
    this.options = {
      ciConfigDir: '.ci',
      huskyConfigDir: '.husky',
      commitlintName: '.eslintignore',
      scripts: {
        prepare: 'husky install',
        lint: 'prettier --write --ignore-unknown',
        release: 'node scripts/release.js',
        changelog: 'conventional-changelog -p angular -i CHANGELOG.md -s',
      },
      devDependencies,
      changelog: {
        publish: {
          allowBranch: 'init',
          conventionalCommits: true,
          exact: true
        }
      }
    };
  }
  async init() {
    console.log('开始配置ci文件夹');
    copyDir(getConfFilePath(this.options.ciConfigDir), getTargetPath(this.options.ciConfigDir));
    copyDir(getConfFilePath(this.options.huskyConfigDir), getTargetPath(this.options.huskyConfigDir));
    copyFile(getConfFilePath(this.options.confFileName), getTargetPath(this.options.confFileName));
    this.addPackage();
    await this.addCodeYml();
    console.log('ci文件夹处理完毕');
  }
  addPackage() {
    addPackage({
      scripts: this.options.scripts,
      devDependencies: this.options.devDependencies,
      changelog:  this.options.changelog,
    });
  }
  async addCodeYml() {
    if (checkFile('.code.yml')) {
      console.log('存在.code.yml文件， 跳过执行');
      return true;
    }
    const input = await prompt([{
      type: 'input',
      name: 'artifact_name',
      message: '项目名称',
    }, {
      type: 'input',
      name: 'artifact_type',
      message: '项目类型',
      initial: 'web',
    }, {
      type: 'input',
      name: 'repository_url',
      message: 'git地址',
    }]);
    const original = getConfFilePath('.code.yml');
    const targetFile = getTargetPath('.code.yml');
    const yml = YAML.parse(readFileSync(original, 'utf8'));
    Object.assign(yml.artifact[0], input);
    writeFileSync(targetFile, YAML.stringify(yml));
  }
}

module.exports = CI;
