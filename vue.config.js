module.exports = {
    devServer: {
        open: true,
        proxy: {
            '/api': {
                "target": 'http://www.liulongbin.top:8000',
                // http://toutiao.itheima.net  http://www.liulongbin.top:8000
                changeOrigin: true,//发送请求头中host会设置成target
                pathRewrite: {
                    '^/api': ''
                },
                // secure: false,
            }
        }
    }
}