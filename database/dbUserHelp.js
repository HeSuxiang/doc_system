const { db } = require("./db");
//resultInfo.js
const { resultInfo, JWT } = require("../database/utils");
const { JSONCookies } = require("cookie-parser");

//路由级别-响应前端的get请求
//获取所有用户
const dbUserHelp = {
  //获取所有用户
  getAllUser: (req, res) => {
    // new URL
    console.log("getAllUser query", req.query);
    db.any(
      "select id, name, password,showname,isdisable,isadmin  from users where 1 = $1 ORDER BY id ASC",
      [1]
    )
      .then((data) => {
        // console.log('DATA:', resultInfo(true, data, "success")); // print data;

        res.send(resultInfo(true, data, "success"));
        // return (resultInfo(true, data, "success"))
      })
      .catch((error) => {
        // console.log('ERROR:', error); // print the error;
        res.send(resultInfo(false, error, "error"));
        // return (resultInfo(false, error, "error"))
      });
  },

  //查询用户密码是否匹配,不要禁用的用户
  queryUser: (req, res) => {
    const { username, password } = req.body;
    // console.log(" queryUser req.body", req.body)
    db.any(
      "select id, name,showname, password ,isadmin, groups from users where name = $1 and isdisable = false",
      [username]
    )
      .then((data) => {
        // console.log(data)
        if (data.length == 1 && data[0].password == password) {
          // console.log('DATA:', resultInfo(true, data, "success")); // print data;

          //设置token
          // const token = JWT.generate({
          // 	username: username,
          // }, "1d")

          var userinfo = {
            // token: token,
            username: data[0].name,
            showname: data[0].showname,
            isadmin: data[0].isadmin,
            groups: data[0].groups,
          };

          // res.cookie('userinfo', JSON.stringify(userinfo), {
          // 	//最大失效时间
          // 	maxAge: 1000 * 60 * 60 * 24 * 1,

          // 	// maxAge: 1000 * 10,
          // 	httpOnly: true, //默认 false 不允许 客户端脚本访问
          // 	// signed: true //加密属性
          // });
          //token返回在header
          // console.log("token返回", token)
          // res.setHeader("Access-Control-Expose-Headers", "token");
          // res.header("token", token)
          res.send(resultInfo(true, userinfo, "success"));
        } else {
          // console.log('ERROR:', error); // print the error;
          res.send(resultInfo(false, "用户密码不匹配", "error"));
        }
      })
      .catch((error) => {
        console.log("ERROR:", error); // print the error;
        res.send(resultInfo(false, error, "error"));
      });
  },

  //添加用户
  addUser: (req, res) => {
    const { username, password, showname } = req.body;
    console.log("add", username, password, showname); //必须配置中间件

    db.task(async (t) => {
      // `t` and `this` here are the same;
      // this.ctx = transaction config + state context;
      var newUserId = 0;
      const userId = await t.oneOrNone(
        "SELECT id, name FROM users WHERE name = $1",
        username,
        (user) => {
          return user ? user.id : 0;
        }
      );
      //用户已存在
      if (userId) {
        console.log("/user/add ", " 用户已存在");
      } else {
        console.log("/user/add ", " 用户不存在");

        newUserId = await t.one(
          "INSERT INTO users(name,password,showname) VALUES($1,$2,$3) RETURNING id",
          [username, password, showname]
        );

        console.log("/user/add eventId ", newUserId);
      }

      return { userId, newUserId };
    })
      .then((data) => {
        const { userId, newUserId } = data;
        if (userId) {
          res.send(resultInfo(false, "", "用户已存在"));
        } else if (userId == 0 && newUserId) {
          res.send(resultInfo(true, "", " 成功"));
        } else res.send(resultInfo(false, error, "错误"));
      })
      .catch((error) => {
        // error
        console.log("catch error", error);
        res.send(resultInfo(false, error, " error"));
      });
  },

  //获取所有用户名字
  getAllUserName: (req, res) => {
    // new URL
    console.log("getAllUserName query", req.query);
    db.any("select   name  from users where 1 = $1 ORDER BY id ASC", [1])
      .then((data) => {
        // console.log('DATA:', resultInfo(true, data, "success")); // print data;
        res.send(resultInfo(true, data, "success"));
        // return (resultInfo(true, data, "success"))
      })
      .catch((error) => {
        // console.log('ERROR:', error); // print the error;
        res.send(resultInfo(false, error, "error"));
        // return (resultInfo(false, error, "error"))
      });
  },

  //setAdmin
  setAdmin: (req, res) => {
    const { id, isadmin } = req.body;
    console.log("setAdmin id", id); //必须配置中间件

    db.any("UPDATE users SET isadmin = $1  WHERE id = $2", [isadmin, id])
      .then((data) => {
        // console.log('DATA:', resultInfo(true, data, "success")); // print data;

        res.send(resultInfo(true, data, "success"));
        // return (resultInfo(true, data, "success"))
      })
      .catch((error) => {
        // console.log('ERROR:', error); // print the error;
        res.send(resultInfo(false, error, "error"));
        // return (resultInfo(false, error, "error"))
      });
  },

  //禁用用户
  disableUser: (req, res) => {
    const { id, isdisable } = req.body;
    console.log("disableUser id", id); //必须配置中间件

    db.any("UPDATE users SET isdisable = $1 WHERE id = $2", [isdisable, id])
      .then((data) => {
        // console.log('DATA:', resultInfo(true, data, "success")); // print data;

        res.send(resultInfo(true, data, "success"));
        // return (resultInfo(true, data, "success"))
      })
      .catch((error) => {
        // console.log('ERROR:', error); // print the error;
        res.send(resultInfo(false, error, "error"));
        // return (resultInfo(false, error, "error"))
      });
  },

  //重置密码000000
  resetPasswd: (req, res) => {
    const { id } = req.body;
    console.log("resetPasswd id", id); //必须配置中间件

    db.any("UPDATE users SET password = $1  WHERE id = $2", ["000000", id])
      .then((data) => {
        // console.log('DATA:', resultInfo(true, data, "success")); // print data;

        res.send(resultInfo(true, data, "success"));
        // return (resultInfo(true, data, "success"))
      })
      .catch((error) => {
        // console.log('ERROR:', error); // print the error;
        res.send(resultInfo(false, error, "error"));
        // return (resultInfo(false, error, "error"))
      });
  },

  //删除用户
  deleteUser: (req, res) => {
    const { id } = req.body;
    console.log("deleteUser id", id); //必须配置中间件

    db.any("DELETE FROM users WHERE id = $1", [id])
      .then((data) => {
        // console.log('DATA:', resultInfo(true, data, "success")); // print data;

        res.send(resultInfo(true, data, "success"));
        // return (resultInfo(true, data, "success"))
      })
      .catch((error) => {
        // console.log('ERROR:', error); // print the error;
        res.send(resultInfo(false, error, "error"));
        // return (resultInfo(false, error, "error"))
      });
  },
};

module.exports = dbUserHelp;
