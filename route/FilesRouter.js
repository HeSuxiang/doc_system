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
const { resultInfo, fileInfo, getdate } = require("../database/resultInfo");

router.get("/getfiles/:index", (req, res) => {
	dbFilesHelp.getfiles(req, res);
})



module.exports = router