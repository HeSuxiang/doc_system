
const { db } = require("./db")
//resultInfo.js
const { resultInfo } = require("../database/resultInfo");

//路由级别-响应前端的get请求
//获取所有用户组
const dbGroupHelp = {
	//获取所有用户组
	getAllGroup: (req, res) => {
		// new URL
		console.log("getAllGroup query", req.query)
		db.any('select id, name, users from groups where 1 = $1 ORDER BY id ASC', [1])
			.then(data => {
				// console.log('DATA:', resultInfo(true, data, "success")); // print data;
				res.send(resultInfo(true, data, "success"))
				// return (resultInfo(true, data, "success"))
			})
			.catch(error => {
				// console.log('ERROR:', error); // print the error;
				res.send(resultInfo(false, error, "error"))
				// return (resultInfo(false, error, "error"))
			});
	},

	// //查询用户组
	// queryGroup: (req, res) => {
	// 	const { username, password } = req.body

	// 	db.any('select id, name from groups where name = $1', [groupname])
	// 		.then(data => {
	// 			// console.log(data)
	// 			if (data.length == 1 && data[0].password == password) {
	// 				console.log('DATA:', resultInfo(true, data, "success")); // print data;
	// 				res.send(resultInfo(true, username, "success"))
	// 			} else {
	// 				// console.log('ERROR:', error); // print the error;
	// 				res.send(resultInfo(false, "用户密码不匹配", "error"))
	// 			}
	// 		})
	// 		.catch(error => {
	// 			console.log('ERROR:', error); // print the error;
	// 			res.send(resultInfo(false, error, "error"))
	// 		});
	// },


	//添加用户组
	addGroup: (req, res) => {
		const { groupname } = req.body
		console.log("add groupname", groupname)//必须配置中间件


		db.tx(async t => {
			// `t` and `this` here are the same;
			// this.ctx = transaction config + state context;
			var newGroupId = 0;
			const groupId = await t.oneOrNone('SELECT id, name FROM groups WHERE name = $1', groupname, (group) => { return group ? group.id : 0 });
			//用户组已存在
			if (groupId) {
				console.log("/group/add ", " 用户组已存在");

			} else {
				console.log("/group/add ", " 用户组不存在");

				newGroupId = await t.one('INSERT INTO groups(name) VALUES($1) RETURNING id', [groupname]);

				console.log("/group/add eventId ", newGroupId);
			}

			return { groupId, newGroupId };

		})
			.then(data => {
				const { groupId, newGroupId } = data;
				if (groupId) {
					res.send(resultInfo(false, "", "用户组已存在"))
				} else if (groupId == 0 && newGroupId) {
					res.send(resultInfo(true, "", " 成功"))
				} else (
					res.send(resultInfo(false, error, "错误"))
				)
			})
			.catch(error => {
				// error
				console.log("catch error", error);
				res.send(resultInfo(false, error, " error"))
			});

	},


	//禁用用户组
	disableUser: (req, res) => {

	}
}

module.exports = dbGroupHelp