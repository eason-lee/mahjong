const fs = require('fs');
const path = require('path');

const icons = {
  'open-door': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
  </svg>`,
  
  'renewal': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
  </svg>`,
  
  'ticket': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-2-1.46l-3 2.94L14.06 8.5l1.42-1.42L17.5 9.14l2.48-2.48L21.4 8.08l-1.4 1.46z"/>
  </svg>`,
  
  'wifi': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
  </svg>`,
  
  'service': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M2 17h20v2H2zm11.84-9.21c.1-.24.16-.51.16-.79 0-1.1-.9-2-2-2s-2 .9-2 2c0 .28.06.55.16.79C6.25 8.6 3.27 11.93 3 16h18c-.27-4.07-3.25-7.4-7.16-8.21z"/>
  </svg>`
};

// 创建目录
const iconDir = path.join(__dirname, '../src/static/images/icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// 写入图标文件
Object.entries(icons).forEach(([name, svg]) => {
  const filePath = path.join(iconDir, `${name}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`Created icon: ${name}.svg`);
}); 