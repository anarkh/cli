# 打包代码

# 进入构建目录
echo '构建绝对目录: '${make_path_abs}

echo '包名: '${file_name}

cd ${make_path_abs}

ls -al

# 压缩dist
if [ -d dist ]; then
    tar -C dist -zcf dist.tgz .
    cp dist.tgz dist.tar.gz
fi
