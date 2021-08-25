#!/bin/sh -e
# 流水线安装依赖脚本， 测试插件已经自带了npm install，这里设置一下registry就好.
npm config set registry https://mirrors.tencent.com/npm/

# 重试最小超时时间设为2分钟
npm config set fetch-retry-mintimeout 120000

# 重试最小超时时间设为4分钟
npm config set fetch-retry-maxtimeout 240000

# 下载包重试次数设置为4次
npm config set fetch-retries 4

npm config ls -l