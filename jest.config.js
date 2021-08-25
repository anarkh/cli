module.exports = {
    // 项目根目录
    rootDir: process.cwd(),
    // 测试用例存放位置
    testMatch: [
        '<rootDir>/test/**/*.spec.ts?(x)',
        '<rootDir>/packages/*/test/*.spec.ts?(x)',
    ],
    // 统计覆盖率的分母来源，设置为源代码路径
    collectCoverageFrom: [
      'packages/**/*.js',
    ],
    // 覆盖率报告的输出目录
    coverageDirectory: 'coverage',
    // 覆盖率忽略以下地址
    coveragePathIgnorePatterns: ['/node_modules/'],
    // 覆盖率报告的格式
    coverageReporters: ['text', 'lcov', 'clover', 'json'],
    // 测试代码引用源代码的路径解析
    moduleNameMapper: {
        '@/(.*)': '<rootDir>/srcnew/$1'
    },
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    }
};
