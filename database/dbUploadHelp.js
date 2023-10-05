
const { pgp, db } = require("./db")
//resultInfo.js
const { resultInfo, fileInfo, getdate } = require("./utils");


const dbUploadHelp = {

	//查询是否有同MD5， 有就插入已有文件信息到数据库 ，秒传
	queryAddFile: (req, res) => {
		// new URL
		console.log("queryFile query", req.body)
		const { filemd5, originalname, dirindex, upuser, uptime } = req.body;
		var fileinfo;
		var newfileinfo;
		db.task(async t => {
			// t.ctx = task config + state context;
			//查询同MD5文件
			fileinfo = await t.any('select id,filename,originalname,dirindex,upuser,uptime,size, pathyear,mimetype, md5 from files where md5 = $1   ORDER BY id ASC', [filemd5]);
			// console.log("await fileinfo", fileinfo);
			fileinfo = fileinfo.length > 0 ? fileinfo[0] : false
			// console.log("  fileinfo.length > 0? fileinfo[0] : false", fileinfo);


			// console.log("有MD5文件", fileinfo);
			//有记录，
			if (fileinfo) {
				//查询当前目录是否有有同名文件
				var hasSomeNameFile;
				fileinfo.originalname = originalname;
				do {
					hasSomeNameFile = await t.any('select id,originalname,dirindex from files where originalname = $1 and dirindex = $2  and isdel = false ORDER BY id ASC', [fileinfo.originalname, dirindex]);
					//有同名文件
					if (hasSomeNameFile && hasSomeNameFile.length > 0) {
						//修改新文件名 加(1)
						var fileFormat = "." + fileinfo.originalname.split('.').at(-1);
						fileinfo.originalname = fileinfo.originalname.replace(fileFormat, "(1)" + fileFormat);
					}
				} while (hasSomeNameFile && hasSomeNameFile.length > 0)

				console.log("insert ", fileinfo.originalname);

				//插入新文件名数据
				newfileinfo = await t.oneOrNone('INSERT INTO files( filename, originalname, dirindex, upuser, uptime, size, pathyear, mimetype, md5,isdel)  VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id',
					[fileinfo.filename, fileinfo.originalname, dirindex, upuser, uptime, fileinfo.size, fileinfo.pathyear, fileinfo.mimetype, fileinfo.md5, false])
			}
			console.log("fileinfo", fileinfo);
			console.log("newfileinfo", newfileinfo);
			return { fileinfo, newfileinfo }
		})
			.then(data => {
				const { fileinfo, newfileinfo } = data;
				// success;
				if (fileinfo) {
					//不用上传
					console.log("不用上传", fileinfo, newfileinfo);
					if (newfileinfo) {
						res.send(resultInfo(true, newfileinfo, "success"))
					} else {
						res.send(resultInfo(true, newfileinfo, "fail"))
					}

				} else {
					console.log("需要上传");
					//需要上传
					res.send(resultInfo(false, fileinfo, "upload"))
				}

			})
			.catch(error => {
				res.send(resultInfo(false, error, "error"))
				// error
			});
	},

	//插入新文件到数据库
	AddFile: (req, res, fileinfo) => {
		// new URL
		console.log("queryFile query", req.query)
		db.task(async t => {
			var hasSomeNameFile;
			do {
				// console.log("select id,originalname");
				// console.log("fileinfo.originalname do", fileinfo.originalname);
				hasSomeNameFile = await t.any('select id,originalname,dirindex from files where originalname = $1 and dirindex = $2 ORDER BY id ASC', [fileinfo.originalname, fileinfo.dirindex]);
				// console.log("select id");
				//有同名文件
				if (hasSomeNameFile.length > 0) {
					//修改新文件名 加(1)
					// console.log("hasSomeNameFile", hasSomeNameFile);
					var fileFormat = "." + fileinfo.originalname.split('.').at(-1);
					fileinfo.originalname = fileinfo.originalname.replace(fileFormat, "(1)" + fileFormat);
					// console.log("fileinfo.originalname", fileinfo.originalname);
				}
			} while (hasSomeNameFile.length > 0)

			//插入数据
			const info = await t.oneOrNone('INSERT INTO files( filename, originalname, dirindex, upuser, uptime, size, pathyear, mimetype, md5,isdel)  VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id',
				[fileinfo.filename, fileinfo.originalname, fileinfo.dirindex, fileinfo.upuser, fileinfo.uptime, fileinfo.size, fileinfo.pathyear, fileinfo.mimetype, fileinfo.md5, false])
			return info;
		}).then(data => {
			// console.log('DATA:', resultInfo(true, data, "success")); // print data;
			if (data.id) {
				res.send(resultInfo(true, data, "success"))

			} else {
				res.send(resultInfo(false, data, "error"))
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

module.exports = dbUploadHelp