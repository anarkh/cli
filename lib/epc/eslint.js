const { getTargetPath, getConfFilePath, checkFile, copyFile, getPackage, addPackage } = require('../util');
const { writeFileSync } = require('fs');
const execa = require('execa');
class ESlintConfig {
  constructor() {
    const { devDependencies } = getPackage({
      devDependencies: [
        'eslint',
        'prettier',
        'eslint-config-prettier',
        'eslint-plugin-react',
        '@typescript-eslint/eslint-plugin',
        '@typescript-eslint/parser',
      ]
    });
    this.options = {
      confFileName: '.eslintrc.js',
      ignoreFileName: '.eslintignore',
      scripts: {
        lint: 'eslint --ext .js,.vue --fix .',
      },
      devDependencies,
    };
  }
  init() {
    console.log('开始配置eslint');
    this.addPackage();
    this.updateConfig();
    this.createIgnoreFile();
    console.log('eslint配置处理完毕');
  }
  // 生成/更新eslint配置
  updateConfig() {
    const targetFile = getTargetPath(this.options.confFileName);
    if (!checkFile(this.options.confFileName)) {
      console.log('未发现eslint配置文件，开始生成');
      copyFile(getConfFilePath(this.options.confFileName), targetFile);
    } else {
      console.log('发现eslint配置文件，更新rules配置');
      const original = require(getConfFilePath(this.options.confFileName));
      const target = require(targetFile);
      target.rules = original.rules;
      const content = `module.exports = ${JSON.stringify(target, null, 2)}`;
      writeFileSync(targetFile, content);
      execa('eslint', ['--fix', targetFile]);
    }
  }
  // 生成eslintignore配置
  createIgnoreFile() {
    const targetFile = getTargetPath(this.options.ignoreFileName);
    if (!checkFile(this.options.ignoreFileName)) {
      console.log('未发现eslintignore文件，生成eslintignore');
      copyFile(getConfFilePath(this.options.ignoreFileName), targetFile);
    }
  }
  addPackage() {
    addPackage({
      scripts: this.options.scripts,
      devDependencies: this.options.devDependencies,
    });
  }
}

module.exports = ESlintConfig;
