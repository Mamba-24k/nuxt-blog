module.exports = app => {
    const express = require('express')
    // var whitelist = ['https://www.coco727.com', 'http://127.0.0.1:8727']
    // var corsOptions = {
    //   origin: function (origin, callback) {
    //     if (whitelist.indexOf(origin) !== -1) {
    //       callback(null, true)
    //     } else {
    //       callback(new Error('Not allowed by CORS'))
    //     }
    //   }
    // }
    app.use(require("cors")({credentials: true,origin: true}))
    app.use(express.json())
    // 本地静态文件托管 
    app.use('/uploads',express.static(__dirname+'/uploads'))

    require("./pluglins/mongoose")(app)
    // nuxt版博客未配置admin的路径， 所以注释此行， vue版博客是需要引入admin的
    // require("./routers/admin/index")(app)
    require("./routers/web/index")(app)
}