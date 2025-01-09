const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

// 输入文件路径
const inputFile = path.resolve(__dirname, '../src/styles/tailwind.css');
// 输出目录
const outputDir = path.resolve(__dirname, '../src/styles');

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 读取输入文件
const css = fs.readFileSync(inputFile, 'utf8');

// 清理和转换 CSS 的函数
function cleanCSS(css) {
  return css
    // 移除注释
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // 移除 @charset
    .replace(/@charset[^;]*;/g, '')
    // 移除空行
    .replace(/^\s*[\r\n]/gm, '')
    // 转换 px 到 rpx
    .replace(/(\d+)px/g, (match, p1) => `${p1 * 2}rpx`)
    // 移除 :where 和 :is 选择器
    .replace(/:where\([^)]+\)/g, '')
    .replace(/:is\([^)]+\)/g, '')
    // 移除 @layer 声明
    .replace(/@layer[^{]*{([^}]*)}/g, '$1')
    // 移除其他不支持的特性
    .replace(/@apply[^;]*;/g, '')
    .replace(/@screen[^{]*{/g, '')
    .replace(/@variants[^{]*{/g, '')
    // 清理多余的空格和分号
    .replace(/;\s*}/g, '}')
    .replace(/\s+/g, ' ')
    .trim();
}

// 处理 CSS
postcss([
  tailwindcss,
  autoprefixer,
])
  .process(css, {
    from: inputFile,
    to: path.join(outputDir, 'tailwind.wxss'),
  })
  .then(result => {
    // 清理和转换 CSS
    const wxss = cleanCSS(result.css);
    
    // 写入输出文件
    fs.writeFileSync(path.join(outputDir, 'tailwind.wxss'), wxss);
    console.log('Tailwind CSS 已成功转换为 WXSS');
  })
  .catch(error => {
    console.error('转换过程中出错:', error);
  }); 