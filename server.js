// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()

const ApiRouter = require("./route/ApiRouter")
const UploadRouter = require("./route/UploadRouter")
const DownLoadRouter = require("./route/DownLoadRouter")
const FilesRouter = require("./route/FilesRouter")

const HomeRouter = require("./route/HomeRouter")
const LoginRouter = require("./route/LoginRouter")
const cors = require('cors');
const { JWT } = require('./database/utils')

//引入cookie-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser("abc"));//cookie 的加密

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




// //设置中间件，cookie校验
app.use((req, res, next) => {
  console.log("cookie校验 req.url ", req.url)
  res.header("Access-Control-Allow-Credentials", "true");
  console.log("req.cookies.userinfo  ", req.cookies.userInfo)



  //检查cookie
  if (req.cookies.userInfo) {
    //有cookie
    const userinfo = JSON.parse(req.cookies.userInfo)
    console.log("has cookie username", userinfo.username);
    console.log("no cookie req.url 访问通过", req.url);
    next()
  } else {
    //无cookie
    // console.log("cookies userinfo", userinfo)
    // if (req.url.includes("/api/user/query") || req.url.includes("/down/")) {
    if (req.url.includes("/api/user/query")) {
      console.log("no cookie req.url 访问通过", req.url);


      next()
    } else {
      console.log("no cookie req.url 访问被拒绝", req.url);
      res.send({ code: 401, errInfo: "cookie无效" })
    }
  }

})

// //设置中间件，token过期校验
// app.use((req, res, next) => {
//   //排除login相关的路由和接口
//   console.log("token校验 req.url ", req.url)
//   if (req.url.includes("/api/user/query") || req.url.includes("/down/")) {
//     console.log("eq.url.includes(/api/user/query) ", req.url.includes("/api/user/query"))

//     console.log("req.url.includes(/ down / )", req.url.includes("/down/"))
//     next()
//     return
//   }

//   const token = req.headers["token"]
//   console.log("token校验", token)

//   if (token) {
//     const payload = JWT.verify(token)
//     console.log("token校验 payload", payload)
//     if (payload) {
//       //重新计算token过期时间
//       const newToken = JWT.generate({
//         username: payload.username,
//       }, "1d")
//       res.setHeader("Access-Control-Expose-Headers", "token");
//       res.header("token", newToken)
//       next()
//     } else {
//       res.setHeader("Access-Control-Expose-Headers", "token");
//       res.header("token", null)
//       res.status(401).send({ code: 401, errInfo: "token无效" })
//       // next() //调试暂时放行
//     }
//   } else {
//     res.setHeader("Access-Control-Expose-Headers", "token");
//     res.header("token", null)
//     res.status(401).send({ code: 401, errInfo: "无token" })
//     // next() //调试暂时放行
//   }
// })



//应用级别
app.use("/api", ApiRouter)
app.use("/upload", UploadRouter)
app.use("/login", LoginRouter)
app.use("/down", DownLoadRouter)

app.use("/files", FilesRouter)

// app.use("/fils", dbFilesHelp)
app.use("/home", HomeRouter)



app.use((req, res) => {
  res.status(404).send("丢了")
})

// 调用 app.listen 方法，指定端口号并启动 web 服务器
const port = 80
app.listen(port, function () {
  console.log('Express server running at http://127.0.0.1:' + port)
})