/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
const express = require("express")

const router = express.Router()
//路由级别
const db = require("../database/db")
const dbDirectorysHelp = require("../database/dbDirectorysHelp")
//resultInfo.js
const { resultInfo, fileInfo, getdate } = require("../database/utils");

//查询文件夹信息
router.get("/getdirs/:index", (req, res) => {
	dbDirectorysHelp.getDirs(req, res);
})

//查询属于parent下的文件夹列表
router.get("/getdirsofparent/:parent", (req, res) => {
	dbDirectorysHelp.getDirsOfParent(req, res);
})

//增加文件夹
router.post("/adddir", (req, res) => {
	// console.log("add body", req.body)//必须配置中间件
	// console.log(req)//必须配置中间件
	dbDirectorysHelp.addDir(req, res);

})

module.exports = router