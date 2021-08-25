/**
 * @description
 * 规范化提交信息
 */

const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const os = require('os');
const { warn, info, error } = require('../util');
const tapdTypes = {
  feature: 'story',
  bugfix: 'bug',
};
const featOrFixReg = /\s?(feat|fix)/;
const featOrFixValidReg = /\s?(feat|fix)\([a-z0-9-/]+\)/i;
const featureOrBugBranchReg = /^(feature|bugfix)\/.*_(\d+)/;

const main = () => {
  const commitMsgFilePath = path.resolve(process.cwd(), '.git/COMMIT_EDITMSG');

  if (!fs.existsSync(commitMsgFilePath)) {
    error(`当前目录: ${commitMsgFilePath} 下未找到.git/COMMIT_EDITMSG文件，请确认`);
    process.exit(-1);
  }

  const commitEditMsg = fs.readFileSync(commitMsgFilePath, {
    encoding: 'utf-8',
  }).toString();

  if (!commitEditMsg || commitEditMsg.length === 0) {
    warn('没有提交信息，直接跳过');
    return;
  }

  const currentBranchName = cp.execSync('git symbolic-ref --short HEAD').toString();
  const match = featureOrBugBranchReg.exec(currentBranchName);

  if (!match || match.length < 3) {
    warn(`分支名${currentBranchName}不符合 feature|bugfix , 直接跳过`);
    return;
  }

  const [m, tapdType, tapdId] = match;

  info(`匹配当前分支名: ${m}`);

  const type = tapdTypes[tapdType];
  const reg = new RegExp(`(--${type}=\\d+)`);
  const preMsg = commitEditMsg.match(reg);

  if (featOrFixReg.test(commitEditMsg) && !featOrFixValidReg.test(commitEditMsg)) {
    warn('\n为了生成更加清晰的CHANGELOG，如果提交类型是feat或者fix，请尽量说明下本次改动的范围\n'
      + '例如: feat(player): 修改播放器的重试逻辑\n');
  }

  // 检查到原提交信息里面没有时，将其替换放到第二行
  if (preMsg && preMsg.length > 1) {
    info('已有tapd id, 跳过不处理');
    const newCommitMessage = `${commitEditMsg.replace(preMsg[1], '')}${os.EOL}${preMsg[1]}`;
    info('提交信息: \n');
    console.log(`"${newCommitMessage}"`);
    fs.writeFileSync(commitMsgFilePath, newCommitMessage, {
      encoding: 'utf-8',
    });
    return;
  }

  info(`自动插入tapd id: --${type}=${tapdId}`);
  const newCommitMessage = `${commitEditMsg}${os.EOL}--${type}=${tapdId}`;
  info('提交信息: \n');
  console.log(`"${newCommitMessage}"`);
  fs.writeFileSync(commitMsgFilePath, `${commitEditMsg}${os.EOL}--${type}=${tapdId}`, {
    encoding: 'utf-8',
  });
};

module.exports = main;
