/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
const express = require("express")

const router = express.Router()
//路由级别
const db = require("../database/db")
const dbFilesHelp = require("../database/dbFilesHelp")
//resultInfo.js
const { resultInfo, fileInfo, getdate } = require("../database/utils");

router.get("/getfiles/:index", (req, res) => {
	dbFilesHelp.getfiles(req, res);
})

//查询文件夹信息
router.get("/getdirs/:index", (req, res) => {
	dbFilesHelp.getDirs(req, res);
})

//查询属于parent下的文件夹列表
router.get("/getdirsofparent/:parentIndex", (req, res) => {
	dbFilesHelp.getDirsOfParentIndex(req, res);
})

//查询属于index下的文件夹和文件列表
router.get("/getdirsandfiles/:parentIndex", (req, res) => {
	dbFilesHelp.getFilesAndDirsOfParentIndex(req, res);
})

//增加文件夹
router.post("/adddir", (req, res) => {
	// console.log("add body", req.body)//必须配置中间件
	// console.log(req)//必须配置中间件
	dbFilesHelp.addDir(req, res);

})

module.exports = router