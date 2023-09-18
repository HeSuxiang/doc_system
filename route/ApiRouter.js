/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
const express = require("express");


const router = express.Router()

const db = require("../database/db")
const dbUserHelp = require("../database/dbUserHelp")
const dbGroupHelp = require("../database/dbGroupHelp")

//resultInfo.js
var resultInfo = require("../database/resultInfo");

//路由级别-响应前端的get请求
//获取所有用户
router.get("/user/all", (req, res) => {
    dbUserHelp.getAllUser(req, res);

})

// router.get("/user/all", (req, res) => {
//     // new URL
//     console.log(req.query)
//     db.any('select id, name, password  from users where 1 = $1', [1])
//         .then(data => {
//             console.log('DATA:', resultInfo(true, data, "success")); // print data;
//             res.send(resultInfo(true, data, "success"))
//         })
//         .catch(error => {
//             console.log('ERROR:', error); // print the error;
//             res.send(resultInfo(false, error, "error"))
//         });


// })

////路由级别-响应前端的post请求
//验证用户名-密码
router.post("/user/query", (req, res) => {

    // console.log(req)//必须配置中间件
    dbUserHelp.queryUser(req, res);


})


////路由级别-响应前端的post请求
//增加用户
router.post("/user/add", async (req, res) => {
    // console.log("add body", req.body)//必须配置中间件
    // console.log(req)//必须配置中间件
    dbUserHelp.addUser(req, res);

})



//获取所有用户组
router.get("/groups/all", (req, res) => {
    dbGroupHelp.getAllGroup(req, res);

})

//增加用户组
router.post("/groups/add", async (req, res) => {
    console.log("add body", req.body)//必须配置中间件
    // console.log(req)//必须配置中间件
    dbGroupHelp.addGroup(req, res);

})
////路由级别-响应前端的put ,delete请求


module.exports = router