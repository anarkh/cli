const { getPackage, getTargetPath, getConfFilePath, copyFile, addPackage } = require('../util');
class Jest {
  constructor() {
    const { devDependencies } = getPackage({
      devDependencies: [
        'jest',
        "ts-jest",
        "@types/jest",
      ]
    });
    this.options = {
      confFileName: 'jest.config.js',
      devDependencies,
      scripts: {
        test: 'npm run test:unit',
        'test:unit': 'jest --clearCache && jest --json --coverage --outputFile=result.json',
        'test:bvt': 'echo 暂无bvt测试',
        'test:e2e': 'echo 暂无e2e测试',
      },
    };
  }
  init() {
    console.log('开始配置jest,dwt');
    this.addPackage();
    this.createJestConfig();
    console.log('jest,dwt配置处理完毕');
  }
  addPackage() {
    addPackage({
      scripts: this.options.scripts,
      devDependencies: this.options.devDependencies,
    });
  }
  createJestConfig() {
    const targetFile = getTargetPath(this.options.confFileName);
    copyFile(getConfFilePath(this.options.confFileName), targetFile);
  }
}

module.exports = Jest;
