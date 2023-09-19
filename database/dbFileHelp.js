
const db = require("./db")
//resultInfo.js
const { resultInfo, fileInfo } = require("../database/resultInfo");


const dbFileHelp = {
	queryOrAddFile: (req, res) => {
		// new URL
		console.log("queryFile query", req.query)
		const { filemd5, filemame } = req.body;

		db.any('select id, md5 from files where md5 = $1 ORDER BY id ASC', [filemd5])
			.then(data => {
				// console.log('DATA:', resultInfo(true, data, "success")); // print data;

				if (data.length == 1) {
					res.send(resultInfo(true, data, "success"))

				} else {
					res.send(resultInfo(false, data, "success"))
				}

				// return (resultInfo(true, data, "success"))
			})
			.catch(error => {
				// console.log('ERROR:', error); // print the error;
				res.send(resultInfo(false, error, "error"))
				// return (resultInfo(false, error, "error"))
			});
	},

	//插入信息到数据库
	AddFile: (req, res, fileinfo) => {
		// new URL
		console.log("queryFile query", req.query)
		db.oneOrNone('INSERT INTO files( filename, originalname, dirindex, upuser, uptime, size, path, mimetype, md5)  VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id',
			[fileinfo.filename, fileinfo.originalname, fileinfo.dirindex, fileinfo.upuser, fileinfo.uptime, fileinfo.size, fileinfo.path, fileinfo.mimetype, fileinfo.md5])
			.then(data => {
				// console.log('DATA:', resultInfo(true, data, "success")); // print data;
				if (data.length == 1) {
					res.send(resultInfo(true, data, "success"))

				} else {
					res.send(resultInfo(false, data, "success"))
				}

				// return (resultInfo(true, data, "success"))
			})
			.catch(error => {
				// console.log('ERROR:', error); // print the error;
				res.send(resultInfo(false, error, "error"))
				// return (resultInfo(false, error, "error"))
			});
	}

}

module.exports = dbFileHelp