
const { pgp, db } = require("./db")
//resultInfo.js
const { resultInfo, fileInfo } = require("./utils");


const dbDirectorysHelp = {


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
	getDirsOfParent: (req, res) => {
		const parent = req.params.parent
		// new URL
		console.log("getDirs query Parent", parent)
		db.any('select * from directorys where Parent = $1 ORDER BY id ASC', [parent])
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
		const { name, permissions, parent, haspermissions } = req.body
		console.log("addDir", name, permissions, parent, haspermissions)//必须配置中间件


		if (!name) {
			console.log("name empty", name);
			res.send(resultInfo(false, "name is empty", "创建时出现错误"))
			return;
		}

		db.task(async t => {
			// `t` and `this` here are the same;
			// this.ctx = transaction config + state context;
			var newDirId = 0;
			const dirId = await t.oneOrNone('SELECT id, name, parent FROM directorys WHERE name = $1 AND parent = $2', [name, parent], (user) => { return user ? user.id : 0 });
			//文件夹已存在
			if (dirId) {
				console.log("/addDir ", " 文件夹已存在");
			} else {
				console.log("/addDir ", " 文件夹不存在 新增...");
				newDirId = await t.one('INSERT INTO directorys(name,permissions,parent,haspermissions) VALUES($1,$2,$3,$4) RETURNING id', [name, permissions, parent, haspermissions]);
				console.log("/addDir  Id ", newDirId);
			}

			return { dirId, newDirId };

		})
			.then(data => {
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

	},
}

module.exports = dbDirectorysHelp

