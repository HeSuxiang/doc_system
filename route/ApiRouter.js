/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
const express = require("express");
const { boolean } = require("optimist");

const router = express.Router()

const db = require("../database/db")
//resultInfo.js
var resultInfo = require("../database/resultInfo");

//路由级别-响应前端的get请求
//获取所有用户
router.get("/user/all", (req, res) => {
    // new URL
    console.log(req.query)
    db.any('select id, name, password  from users where 1 = $1', [1])
        .then(data => {
            console.log('DATA:', resultInfo(true, data, "success")); // print data;
            res.send(resultInfo(true, data, "success"))
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
            res.send(resultInfo(false, error, "error"))
        });


})

////路由级别-响应前端的post请求
//验证用户名-密码
router.post("/user/query", (req, res) => {

    // console.log(req)//必须配置中间件
    const { username, password } = req.body

    db.any('select id, name, password from users where name = $1', [username])
        .then(data => {
            // console.log(data)
            if (data.length == 1 && data[0].password == password) {
                console.log('DATA:', resultInfo(true, data, "success")); // print data;
                res.send(resultInfo(true, data, "success"))
            } else {
                // console.log('ERROR:', error); // print the error;
                res.send(resultInfo(false, "", "error"))
            }
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
            res.send(resultInfo(false, error, "error"))
        });


})


////路由级别-响应前端的post请求
//验证用户名-密码
router.post("/user/add", async (req, res) => {
    // console.log("add body", req.body)//必须配置中间件
    // console.log(req)//必须配置中间件
    const { username, password } = req.body
    console.log("add", username, password)//必须配置中间件


    db.tx(async t => {
        // `t` and `this` here are the same;
        // this.ctx = transaction config + state context;
        var newUserId = 0;
        const userId = await t.oneOrNone('SELECT id, name FROM users WHERE name = $1', username, (user) => { return user ? user.id : 0 });
        //用户已存在
        if (userId) {
            console.log("/user/add ", " 用户已存在");

        } else {
            console.log("/user/add ", " 用户不存在");

            newUserId = await t.one('INSERT INTO users(name,password) VALUES($1,$2) RETURNING id', [username, password]);

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

})

////路由级别-响应前端的put ,delete请求


module.exports = router