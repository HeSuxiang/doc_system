/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
const express = require("express");

const router = express.Router();

const db = require("../database/db");
const dbUserHelp = require("../database/dbUserHelp");
const dbGroupHelp = require("../database/dbGroupHelp");

//resultInfo.js
const { resultInfo } = require("../database/utils");

//路由级别-响应前端的get请求
//获取所有用户
router.get("/user/all", (req, res) => {
  dbUserHelp.getAllUser(req, res);
});

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
});

////路由级别-响应前端的post请求
//增加用户
router.post("/user/add", (req, res) => {
  // console.log("add body", req.body)//必须配置中间件
  // console.log(req)//必须配置中间件
  dbUserHelp.addUser(req, res);
});

//获取所有用户名字
router.get("/user/allusersname", (req, res) => {
  dbUserHelp.getAllUserName(req, res);
});

//设置用户为管理员
router.post("/user/setadmin", (req, res) => {
  // console.log("add body", req.body)//必须配置中间件
  // console.log(req)//必须配置中间件
  dbUserHelp.setAdmin(req, res);
});

////禁用用户
router.post("/user/disableuser", (req, res) => {
  // console.log("add body", req.body)//必须配置中间件
  // console.log(req)//必须配置中间件
  dbUserHelp.disableUser(req, res);
});

////重置密码000000
router.post("/user/resetpasswd", (req, res) => {
  // console.log("add body", req.body)//必须配置中间件
  // console.log(req)//必须配置中间件
  dbUserHelp.resetPasswd(req, res);
});

//删除用户
router.post("/user/deleteuser", (req, res) => {
  // console.log("add body", req.body)//必须配置中间件
  // console.log(req)//必须配置中间件
  dbUserHelp.deleteUser(req, res);
});

//获取所有用户组
router.get("/groups/all", (req, res) => {
  dbGroupHelp.getAllGroup(req, res);
});

//获取所有用户组名字
router.get("/groups/allgroupsname", (req, res) => {
  dbGroupHelp.getAllGroupName(req, res);
});

//增加用户组
router.post("/groups/add", async (req, res) => {
  // console.log("add body", req.body); //必须配置中间件
  // console.log(req)//必须配置中间件
  dbGroupHelp.addGroup(req, res);
});

//更新用户组
router.post("/groups/update", async (req, res) => {
  // console.log("update body", req.body); //必须配置中间件
  // console.log(req)//必须配置中间件
  dbGroupHelp.updateGroup(req, res);
});
////路由级别-响应前端的put ,delete请求

//删除用户组
router.post("/groups/delete", async (req, res) => {
  // console.log("update body", req.body); //必须配置中间件
  // console.log(req)//必须配置中间件
  dbGroupHelp.deleteGroup(req, res);
});

module.exports = router;
