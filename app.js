// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()

const HomeRouter = require("./route/HomeRouter")
const LoginRouter = require("./route/LoginRouter")


// 托管静态资源
app.use(express.static('./dist'))



//配置静态资源
app.use(express.static("public"))
app.use("/static", express.static("static"))

//应用级别
app.use("/home", HomeRouter)
app.use("/login", LoginRouter)


app.use((req, res) => {
  res.status(404).send("丢了")
})

// 调用 app.listen 方法，指定端口号并启动 web 服务器
const port = 80
app.listen(port, function () {
  console.log('Express server running at http://127.0.0.1:' + port)
})