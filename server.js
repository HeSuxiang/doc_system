// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()

const ApiRouter = require("./route/ApiRouter")
const UploadRouter = require("./route/UploadRouter")
const FilesRouter = require("./route/FilesRouter")
// const dbFilesAndDirectorysHelp = require("./route/dbFilesAndDirectorysHelp")
const HomeRouter = require("./route/HomeRouter")
const LoginRouter = require("./route/LoginRouter")
const cors = require('cors');

//Express 有一个官方支持的模块 body-parser，它包括一个 解析器，用于 URL 编码的请求体，比如 HTML 表单提交的请求体。
app.use(express.urlencoded({ extended: false }))

//Express 有一个内置 express.json() 方法，该方法返回一个 Express 中间件函数，将 JSON HTTP 请求体解析为 JavaScript 对象。
//json() 中间件将一个 body 属性添加到 Express req 中。您可以使用 req.body
// 解析此应用程序的 JSON 正文。确保在路由处理程序之前放置 app.use(express.json())！
app.use(express.json())


app.use(express.urlencoded({ extended: false }));

//CORS跨域配置和静态访问服务
app.use(cors({
  origin: '*'
}));

// 托管静态资源
app.use(express.static('./dist'))



//配置静态资源
app.use(express.static("public"))
app.use("/static", express.static("static"))

//应用级别
app.use("/api", ApiRouter)
app.use("/upload", UploadRouter)
app.use("/files", FilesRouter)

// app.use("/fils", dbFilesHelp)
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