
const { boolean } = require("optimist");
const { pgp, db } = require("./db")
//resultInfo.js
const { resultInfo, fileInfo } = require("./utils");


const dbFilesHelp = {

	//查询文件列表
	getfiles: (req, res) => {
		const index = req.params.index
		// new URL
		console.log("getfiles query index", index)
		db.any('select * from files where dirindex = $1 ORDER BY id ASC', [index])
			.then(data => {
				// console.log('DATA:', data); // print data;
				res.send(resultInfo(true, data, "success"))
				// return (resultInfo(true, data, "success"))
			})
			.catch(error => {
				// console.log('ERROR:', error); // print the error;
				res.send(resultInfo(false, error, "error"))
				// return (resultInfo(false, error, "error"))
			});
	},

	//查询文件夹信息
	getDirs: (req, res) => {
		const index = req.params.index
		// new URL
		console.log("getDirs query index", index)
		db.any('select * from directorys where index = $1 ORDER BY id ASC', [index])
			.then(data => {
				// console.log('DATA:', data); // print data;
				res.send(resultInfo(true, data, "success"))
				// return (resultInfo(true, data, "success"))
			})
			.catch(error => {
				// console.log('ERROR:', error); // print the error;
				res.send(resultInfo(false, error, "error"))
				// return (resultInfo(false, error, "error"))
			});
	},

	//查询属于index下的文件夹列表
	getDirsOfParentIndex: (req, res) => {
		const parentIndex = req.params.parentIndex
		// new URL
		console.log("getDirs query parentindex", parentIndex)
		db.any('select * from directorys where parentindex = $1 ORDER BY id ASC', [parentIndex])
			.then(data => {
				// console.log('DATA:', data); // print data;
				res.send(resultInfo(true, data, "success"))
				// return (resultInfo(true, data, "success"))
			})
			.catch(error => {
				// console.log('ERROR:', error); // print the error;
				res.send(resultInfo(false, error, "error"))
				// return (resultInfo(false, error, "error"))
			});
	},


	// 'SELECT  * FROM ( SELECT  parentindex, name, permissions,haspermissions,null as upuser, null as size, null as path,null as mimetype, null as md5,'dir' as type FROM public.directorys where parentindex  =1  union SELECT  dirindex as parentindex,  originalname as name, null as permissions, null as haspermissions ,upuser, size, path, mimetype,md5,'file' as type  FROM public.files where dirindex  = 1) AS foo ORDER BY type'

	//查询属于index下的文件夹和文件列表
	getFilesAndDirsOfParentIndex: (req, res) => {
		const parentIndex = req.params.parentIndex
		// new URL

		var typeDir = "dir";
		var typefile = "file";


		console.log("getDirs query parentindex", parentIndex)

		//pgadmin 语句
		// 		SELECT * FROM(
		// 			SELECT id, index, name, null as filename,permissions, haspermissions, null as upuser, null as uptime,null as size, null as path, null as mimetype, null as md5, 'dir' as type FROM public.directorys where parentindex = 1
		//         union
		//           SELECT id, dirindex as index, originalname as name, filename,null as permissions, null as haspermissions, upuser,uptime, size, path, mimetype, md5, 'file' as type  FROM public.files where dirindex = 1
		// 		)
		//         AS foo 
		//         ORDER BY type, id

		db.any('SELECT  * FROM ( SELECT id, index, name, null as filename, permissions,haspermissions,null as upuser, null as uptime,null as size, null as path,null as mimetype, null as md5, $1 as type FROM public.directorys where parentindex  =$3  union SELECT id, dirindex as index,  originalname as name,filename, null as permissions, null as haspermissions ,upuser,uptime, size, path, mimetype,md5, $2 as type  FROM public.files where dirindex  = $3) AS foo ORDER BY type , id', [typeDir, typefile, parentIndex])

			.then(data => {
				// console.log('DATA:', data); // print data;
				res.send(resultInfo(true, data, "success"))
				// return (resultInfo(true, data, "success"))
			})
			.catch(error => {
				// console.log('ERROR:', error); // print the error;
				res.send(resultInfo(false, error, "error"))
				// return (resultInfo(false, error, "error"))
			});
	},


	//增加文件夹
	addDir: (req, res) => {
		console.log("addDir req.body", req.body);
		const { name, permissions, parentindex, haspermissions } = req.body
		console.log("addDir", name, permissions, parentindex, haspermissions)//必须配置中间件
		console.log("typeof haspermissions", typeof haspermissions, haspermissions);

		if (!name) {
			console.log("name empty", name);
			res.send(resultInfo(false, "name is empty", "创建时出现错误"))
			return;
		}

		db.task(async t => {
			// `t` and `this` here are the same;
			// this.ctx = transaction config + state context;

			//获取最大文件夹index
			var maxIndex = await t.one('SELECT MAX(index) FROM directorys')
			console.log("addDir max index", maxIndex.max);

			var dirId = 0;
			var newDirId = 0;
			var newDirName = name;
			//查询文件夹下的同名文件夹
			do {
				dirId = await t.oneOrNone('SELECT id, name, parentindex FROM directorys WHERE name = $1 AND parentindex = $2', [name, parentindex], (user) => { return user ? user.id : 0 });
				//文件夹已存在
				if (dirId) {
					console.log("/addDir ", " 文件夹已存在");
					//修改新文件名 加(1)
					// console.log("hasSomeNameFile", hasSomeNameFile);
					newDirName = newDirName + "(1)";
				}

			} while (dirId)

			console.log("/addDir ", "   新增...");
			// maxIndex++;
			console.log("addDir max indesdfsdfx ++", maxIndex.max + 1);
			newDirId = await t.one('INSERT INTO directorys(index,name,permissions,parentindex,haspermissions) VALUES($1,$2,$3,$4,$5) RETURNING id', [maxIndex.max + 1, newDirName, permissions, parentindex, haspermissions]);
			console.log("/addDir  Id ", newDirId);

			return { dirId, newDirId };

		}).then(data => {
			// res.send(resultInfo(false, data, "max index"))
			const { dirId, newDirId } = data;
			if (dirId) {
				res.send(resultInfo(false, dirId, "文件夹已存在"))
			} else if (dirId == 0 && newDirId) {
				res.send(resultInfo(true, newDirId, "创建成功"))
			} else (
				res.send(resultInfo(false, error, "创建时出现错误"))
			)
		})
			.catch(error => {
				// error
				console.log("catch error", error);
				res.send(resultInfo(false, error, "未知错误"))
			});


	}

}

module.exports = dbFilesHelp