/**
 * 用于发布前执行版本更新，自动生成提交信息，自动打tag等
 */
 const { prompt } = require('enquirer');
 const fs = require('fs');
 const path = require('path');
 const execa = require('execa');
 const { error, info, success } = require('./util');
 const run = (bin, arg, opts = {}) => execa(bin, arg, { stdio: 'inherit', ...opts });
 const getCurrentBranchName = async () => {
    const result = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
    return result.stdout;
 };
 
 const main = async () => {
    // 分支判断
    const currentBranchName = await getCurrentBranchName();
    if (currentBranchName !== 'master') {
      error(`只允许在master上执行release命令. 当前分支: ${currentBranchName} 不符合`);
      return false;
    }

    info('△ 正在进行本地单元测试');
    await run('yarn', ['test']);
    info('√ 本地单元测试完成');
 
    // lerna 包发布
    const { needLerna } = await prompt({
        type: 'select',
        name: 'needLerna',
        message: '是否需要发布npm包?(lerna publish)',
        choices: ['Y', 'N'],
    });

    if (needLerna === 'Y') {
        let changed = true;
        try {
            const result = await run('lerna', ['changed']);
            console.log(result);
            if (result.exitCode !== 0) {
                changed = false;
            }
        } catch(e) {
            changed = false;
        }
        if(changed) {
            await run('lerna', ['publish', '--registry', 'https://registry.npmjs.org/']);
        } else {
            const { lernaChanged } = await prompt({
                type: 'select',
                name: 'lernaChanged',
                message: '未发现包内容更改(可能原因：上次发布失败中断/代码未发生更改)，是否继续发布',
                choices: ['Y', 'N'],
            });
            if (lernaChanged === 'Y') {
                await run('lerna', ['publish', '--force-publish', '--registry', 'https://registry.npmjs.org/']);
            } else {
                error('取消发布');
                return false;
            }
        }

        const learnVersion = require('../lerna.json').version;
        const package = require('../package.json');
        package.version = learnVersion;
        fs.writeFileSync(path.resolve(process.cwd(), './package.json'), JSON.stringify(package, null, 2));
    } else {
        // git提交
        info('△ 提交到本地git: ');
        await run('git', ['add', '-A']);
        await run('git', ['commit', '-m', "release"]);
        info('√ 提交完成');
    }
   // 生成CHANGELOG.md
    info('△ 正在生成CHANGELOG.md');
    await run('yarn', ['changelog']);
    info('√ 生成CHANGELOG.md完成');


    // git提交
    info('△ 提交到本地git: ');
    await run('git', ['add', '-A']);
    await run('git', ['commit', '-m', "chore: 更新CHANGELOG"]);
    info('√ 提交完成');
    
    // 推送远程
    await run('git', ['push']);
    success('\n√ 执行完成');
 };

 main().catch((err) => {
    console.log(err);
  });
 