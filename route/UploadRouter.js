const express = require("express");

const router = express.Router()

var multer = require('multer')
const fs = require("fs")

const db = require("../database/db")
const dbFileHelp = require("../database/dbFileHelp")
//resultInfo.js
const { resultInfo, fileInfo } = require("../database/resultInfo");

const path = require("path")

//The disk storage engine gives you full control on storing files to disk.
const storage = multer.diskStorage({
	//设置文件存储位置
	destination: function (req, file, cb) {
		let date = new Date();
		let year = date.getFullYear();
		let dir = "./uploads/" + year

		//判断目录是否存在，没有则创建
		if (!fs.existsSync(dir)) {
			console.log("dir", dir);
			fs.mkdirSync(dir, {

				recursive: true
			});
		}

		//dir就是上传文件存放的目录
		cb(null, dir);
	},
	filename: function (req, file, cb) {
		// nodejs express multer 中文名乱码【转】
		// 文件上传服务器端接收的文件列表中文件名不支持中文，都是乱码，查询发现nodejs对中文支持的不好。
		// 找了半天，发现这个解决方法确实有效！！！！！核心代码
		// 解决中文名乱码的问题
		file.originalname = Buffer.from(file.originalname, "latin1").toString(
			"utf8"
		);


		// console.log("fileFormat", fileFormat);
		// console.log("storage originalname", file.originalname);
		// console.log("storage fieldname", file.fieldname);
		// const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		// cb(null, file.fieldname + '-' + uniqueSuffix)
		cb(null, file.originalname)
		// console.log("storage uniqueSuffix=", file.fieldname + '-' + uniqueSuffix);
	}
})
var upload = multer({ storage: storage })

//单文件上传 带MD5
router.post('/file', upload.single('file'), function (req, res, next) {
	// req.files is array of `photos` files
	// req.body will contain the text fields, if there were any
	console.log("file", req.file);
	console.log("post body.md5", req.body.md5);
	const { md5, dirindex, upuser } = req.body


	console.log(md5, dirindex, upuser);
	//重新用MD5命名文件
	const file = req.file;
	const fileFormat = (file.originalname).split('.').at(-1); // 取后缀
	const newFileName = req.body.md5 + "." + fileFormat;

	const filepath = path.join(file.destination, file.filename);
	const newfilepath = path.join(file.destination, newFileName);
	fs.renameSync(filepath, newfilepath);

	//设置文件信息
	var fileinfo = fileInfo(newFileName, file.originalname, parseInt(dirindex), upuser, Date.now(), file.size, file.path, file.mimetype, md5)
	//插入信息到数据库
	dbFileHelp.AddFile(req, res, fileinfo);


})

//多文件上传
// router.post('/files', upload.any('file', 999), function (req, res, next) {

router.post('/files', upload.array('files', 999), function (req, res, next) {
	// req.files is array of `photos` files
	// req.body will contain the text fields, if there were any
	console.log(req.files);

	// req.body.files.forEach(file => {
	// 	console.log("upload originalname", file.originalname);
	// 	console.log("upload mimetype", file.mimetype);
	// 	console.log("upload size", file.size);
	// 	console.log("upload destination", file.destination);
	// 	console.log("upload filename", file.filename);
	// 	console.log("upload path", file.path);
	// });
	res.send(resultInfo(true, "files", "success"));

})

router.post("/query", (req, res) => {
	// const { fileMd5, fileName } = req.body;
	// console.log("queryFile fileMd5", fileMd5);
	// console.log("queryFile fileName", fileName);
	dbFileHelp.queryOrAddFile(req, res);
	// res.send(resultInfo(true, "queryFile", "success"))
})



router.get("/test", (req, res) => {
	console.log("upload test");
	res.send(resultInfo(true, "Test ok", "success"))
})

module.exports = router