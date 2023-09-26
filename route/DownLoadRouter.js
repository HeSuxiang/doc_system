/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
const express = require("express")

const router = express.Router()

const dbDownLoadHelp = require("../database/dbDownLoadHelp")

router.get("/:year/:md5/:filename/:name", (req, res) => {
	dbDownLoadHelp.downFile(req, res);
})

module.exports = router