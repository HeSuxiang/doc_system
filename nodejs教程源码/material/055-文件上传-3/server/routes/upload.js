/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //判断 req.session.user
    res.render('upload', { title: 'Express' });
  
});

module.exports = router