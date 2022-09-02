const path = require( 'path' )

function resolve ( dir ) {
  // __dirname 当前目录
  // console.log(path.join( __dirname, 'src/components/DynamicForm/icons' ), __dirname)
  return path.join( __dirname, dir )
}

module.exports = {
  runtimeCompiler: true,
  publicPath: '/',
  devServer: {
    port: 8088
  },
  chainWebpack ( config ) {
    console.log(config.module)
    // set svg-sprite-loader
    config.module
      .rule( 'svg' )
      .exclude.add( resolve( 'src/components/DynamicForm/icons' ) )
      .end()
      
    config.module
      .rule( 'icons' )
      .test( /\.svg$/ )
      .include.add( resolve( 'src/components/DynamicForm/icons' ) ) // 处理svg 雪碧图, 把每个icon 放在symbol中. 通过use元素使用该symbol.
      .end()
      .use( 'svg-sprite-loader' )
      .loader( 'svg-sprite-loader' )
      .options( {
        symbolId: 'icon-[name]'
      } )
      .end()
  }
}
