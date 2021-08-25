const { getPackage, getTargetPath, getConfFilePath, copyFile, addPackage } = require('../util');
class Jest {
  constructor() {
    const { dependencies, devDependencies } = getPackage({
        dependencies: [
            'typescript',
        ],
      devDependencies: [
        '@types/node',
      ]
    });
    this.options = {
      confFileName: 'tsconfig.json',
      dependencies,
      devDependencies,
    };
  }
  init() {
    console.log('开始配置ts');
    this.addPackage();
    this.createJestConfig();
    console.log('ts配置处理完毕');
  }
  addPackage() {
    addPackage({
        dependencies: this.options.dependencies,
      devDependencies: this.options.devDependencies,
    });
  }
  createJestConfig() {
    const targetFile = getTargetPath(this.options.confFileName);
    copyFile(getConfFilePath(this.options.confFileName), targetFile);
  }
}

module.exports = Jest;
