const { readdirSync, existsSync, statSync, writeFileSync, readFileSync, accessSync, mkdirSync, copyFileSync } = require('fs')
const { resolve, basename, extname, join } = require('path');
const { yellowBright, blueBright, redBright, greenBright } = require('chalk');
const { spawn } = require('child_process');
const { type } = require('os');
const { merge } = require('lodash');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const package = require(resolve(process.cwd(), 'package.json'));

const findTargetFilePath = (entry, targetFile) => {
  let result = '';
  walkDir(entry, (fileFullPath, filename) => {
    const baseName = basename(filename);
    const baseNameWithoutExtName = baseName.replace(extname(baseName), '');
    if (baseName === targetFile || baseNameWithoutExtName === targetFile) {
      result = fileFullPath;
    }
  });
  return result;
};

const walkDir = (entry, callback) => {
  const files = readdirSync(entry);
  for (let i = 0, len = files.length; i < len; i++) {
    const filename = files[i];
    const file = join(entry, filename);
    if (existsSync(file)) {
      const stats = statSync(file);
      if (!stats.isDirectory()) {
        callback(file, filename, extname(filename));
      } else {
        walkDir(file, callback);
      }
    }
  }
};
// 获取包名
const getName = () => {
  return package.name;
};
// 获取目标文件的文件路径，如果是本地调试，则指向本地demo文件夹
const getTargetPath = (filePath) => {
  const name = getName();
  if (name === 'anarkh-cli') {
    const demoPath = resolve(process.cwd(), 'demo/');
    if(!existsSync(demoPath)) {
      mkdirSync(demoPath);
    }
    return resolve(process.cwd(), 'demo/', filePath);
  }
  return resolve(process.cwd(), filePath);
};
const getConfFilePath = filePath => resolve(__dirname, '../', filePath);
// 判断文件是否存在
const checkFile = (filePath) => {
  const p = getTargetPath(filePath);
  return existsSync(p);
};
// 获取package配置
const getPackage = (obj) => {
  const result = {};
  Object.keys(obj).forEach((key) => {
    if (package[key] && Array.isArray(obj[key])) {
      let temp = {};
      obj[key].forEach((item) => {
        if (package[key][item]) {
          temp[item] = package[key][item];
        }
      });
      result[key] = temp;
    }
  });
  return result;
};
// 获取目标package文件配置，如果没有则返回空对象
const getTargetPackage = () => {
  const targetFile = getTargetPath('package.json');
  if (existsSync(targetFile)) {
    // eslint-disable-next-line no-undef
    delete require.cache[require.resolve(targetFile)];
    // eslint-disable-next-line no-undef
    return require(targetFile);
  } else {
    return {};
  }
};
const copyFile = (src, dist = process.cwd()) => {
  writeFileSync(dist, readFileSync(src));
};
/*
 * 复制目录、子目录，及其中的文件
 * @param src {String} 要复制的目录
 * @param target {String} 复制到目标目录
 */
const copyDir = (src, target) => {
  if (type() === 'Linux') {
    spawn('cp', ['-r', src, target]);
    return;
  }
  
  const copy = (src, dist) => {
    const paths = readdirSync(src);
    paths.forEach((path) => {
      const srcPath = `${src}/${path}`;
      const targetPath = `${dist}/${path}`;
      const statData = statSync(srcPath);
      // 判断是文件还是目录
      if (statData.isFile()) {
        copyFileSync(srcPath, targetPath);
      } else if (statData.isDirectory() && path != '_') {
        // 当是目录是，递归复制
        copy(srcPath, targetPath);
      }
    });
  };
  
  try {
    accessSync(target);
  } catch (err) {
    mkdirSync(target);
  }
  copy(src, target);
};

const addPackage = (option) => {
  const targetFile = getTargetPath('package.json');
  let original = getTargetPackage();
  merge(original, option);
  writeFileSync(targetFile, JSON.stringify(original, null, 2));
}
const warn = (...args) => {
  console.log(yellowBright(...args));
};

const info = (...args) => {
  console.log(blueBright(...args));
};

const error = (...args) => {
  console.log(redBright(...args));
};

const success = (...args) => {
  console.log(greenBright(...args));
};

module.exports = {
  findTargetFilePath,
  walkDir,
  getName,
  getConfFilePath,
  checkFile,
  getPackage,
  getTargetPackage,
  copyFile,
  copyDir,
  getTargetPath,
  addPackage,
  warn,
  info,
  error,
  success,
};
