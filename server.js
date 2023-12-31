// 导入 express 模块
const express = require("express");
// 创建 express 的服务器实例
const app = express();

const ApiRouter = require("./route/ApiRouter");
const UploadRouter = require("./route/UploadRouter");
const DownLoadRouter = require("./route/DownLoadRouter");
const FilesRouter = require("./route/FilesRouter");

const HomeRouter = require("./route/HomeRouter");
const LoginRouter = require("./route/LoginRouter");
const cors = require("cors");
const { JWT } = require("./database/utils");

//引入cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser("abc")); //cookie 的加密

//Express 有一个官方支持的模块 body-parser，它包括一个 解析器，用于 URL 编码的请求体，比如 HTML 表单提交的请求体。
app.use(express.urlencoded({ extended: false }));

//Express 有一个内置 express.json() 方法，该方法返回一个 Express 中间件函数，将 JSON HTTP 请求体解析为 JavaScript 对象。
//json() 中间件将一个 body 属性添加到 Express req 中。您可以使用 req.body
// 解析此应用程序的 JSON 正文。确保在路由处理程序之前放置 app.use(express.json())！
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// //设置跨域请求
// app.all('*', function (req, res, next) {
//   //设置请求头
//   //允许所有来源访问
//   res.header('Access-Control-Allow-Origin', '*')
//   //用于判断request来自ajax还是传统请求
//   res.header("Access-Control-Allow-Headers", " Origin, X-Requested-With, Content-Type, Accept");
//   //允许访问的方式
//   res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
//   //修改程序信息与版本
//   res.header('X-Powered-By', ' 3.2.1')
//   //内容类型：如果是post请求必须指定这个属性
//   res.header('Content-Type', 'application/json;charset=utf-8')
//   next()
// })

// // Flag to indicate whether we are in a DEV environment:
// const $DEV = process.env.NODE_ENV === 'development';
// if ($DEV) {
//   // If it is not a DEV environment:
//   // CORS跨域配置和静态访问服务
//   app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
//   }));
// } else {
//   app.use(cors({
//     origin: '*',
//     credentials: true
//   }));
// }

// If it is not a DEV environment:
//CORS跨域配置和静态访问服务
app.use(
  cors({
    //正式打包时用  origin: "*",
    // origin: "*",
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// 托管静态资源
app.use(express.static("./dist"));

//配置静态资源
app.use(express.static("public"));
app.use("/static", express.static("static"));

// //设置中间件，cookie校验
app.use((req, res, next) => {
  // console.log("cookie校验 req.url ", req.url)
  res.header("Access-Control-Allow-Credentials", "true");
  // console.log("req.cookies   ", req.cookies)
  // console.log("req.cookies.userinfo  ", req.cookies.userinfo)

  //检查cookie
  if (req.cookies.userinfo) {
    //有cookie
    const userinfo = JSON.parse(req.cookies.userinfo);
    console.log("has cookie username", userinfo.username);

    next();
  } else {
    //无cookie
    // console.log("cookies userinfo", userinfo)
    // if (req.url.includes("/api/user/query") || req.url.includes("/down/")) {
    if (req.url.includes("/api/user/query")) {
      console.log("no cookie req.url 访问通过", req.url);
      next();
    } else if (req.url.includes("/down/")) {
      console.log("no cookie req.url 下载访问通过", req.url);
      next();
    } else {
      console.log("no cookie req.url 访问被拒绝", req.url);
      res.send({ code: 401, errInfo: "cookie无效" });
    }
  }
});

//应用级别
app.use("/api", ApiRouter);
app.use("/upload", UploadRouter);
app.use("/login", LoginRouter);
app.use("/down", DownLoadRouter);

app.use("/files", FilesRouter);

// app.use("/fils", dbFilesHelp)
app.use("/home", HomeRouter);

app.use((req, res) => {
  res.status(404).send("丢了");
});

// 调用 app.listen 方法，指定端口号并启动 web 服务器
const port = 80;
app.listen(port, function () {
  console.log("Express server running at port " + port);
});
