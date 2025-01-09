const fs = require('fs');
const path = require('path');

// 源目录和目标目录
const sourceDir = path.resolve(__dirname, '../src/static/icons');
const targetDir = path.resolve(__dirname, '../dist/dev/mp-weixin/static/icons');

// 确保目标目录存在
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 复制文件
fs.readdirSync(sourceDir).forEach(file => {
  if (file.endsWith('.svg')) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Copied icon: ${file}`);
  }
}); 