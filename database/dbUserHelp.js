
const { db } = require("./db")
//resultInfo.js
const { resultInfo } = require("../database/resultInfo");

//路由级别-响应前端的get请求
//获取所有用户
const dbUserHelp = {
	//获取所有用户
	getAllUser: (req, res) => {
		// new URL
		console.log("getAllUser query", req.query)
		db.any('select id, name, password,showname,isdisable,isadmin  from users where 1 = $1 ORDER BY id ASC', [1])
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

	//查询用户密码是否匹配
	queryUser: (req, res) => {
		const { username, password } = req.body

		db.any('select id, name, password from users where name = $1', [username])
			.then(data => {
				// console.log(data)
				if (data.length == 1 && data[0].password == password) {
					console.log('DATA:', resultInfo(true, data, "success")); // print data;
					res.send(resultInfo(true, username, "success"))
				} else {
					// console.log('ERROR:', error); // print the error;
					res.send(resultInfo(false, "用户密码不匹配", "error"))
				}
			})
			.catch(error => {
				console.log('ERROR:', error); // print the error;
				res.send(resultInfo(false, error, "error"))
			});
	},


	//添加用户
	addUser: (req, res) => {
		const { username, password, showname } = req.body
		console.log("add", username, password, showname)//必须配置中间件


		db.task(async t => {
			// `t` and `this` here are the same;
			// this.ctx = transaction config + state context;
			var newUserId = 0;
			const userId = await t.oneOrNone('SELECT id, name FROM users WHERE name = $1', username, (user) => { return user ? user.id : 0 });
			//用户已存在
			if (userId) {
				console.log("/user/add ", " 用户已存在");

			} else {
				console.log("/user/add ", " 用户不存在");

				newUserId = await t.one('INSERT INTO users(name,password,showname) VALUES($1,$2,$3) RETURNING id', [username, password, showname]);

				console.log("/user/add eventId ", newUserId);
			}

			return { userId, newUserId };

		})
			.then(data => {
				const { userId, newUserId } = data;
				if (userId) {
					res.send(resultInfo(false, "", "用户已存在"))
				} else if (userId == 0 && newUserId) {
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


	//禁用用户
	disableUser: (req, res) => {

	}
}

module.exports = dbUserHelp