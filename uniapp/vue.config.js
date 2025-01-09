module.exports = {
  transpileDependencies: ['@dcloudio/uni-ui'],
  chainWebpack: (config) => {
    // 处理svg图片
    config.module
      .rule('svg')
      .exclude.add(/node_modules/)
      .end()
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'static/img/[name].[hash:8].[ext]'
      })
  }
} 