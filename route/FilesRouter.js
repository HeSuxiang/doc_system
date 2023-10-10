/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
const express = require("express");

const router = express.Router();
//路由级别
const db = require("../database/db");
const dbFilesHelp = require("../database/dbFilesHelp");
//resultInfo.js
const { resultInfo, fileInfo, getdate } = require("../database/utils");

router.get("/getfiles/:index", (req, res) => {
  dbFilesHelp.getfiles(req, res);
});

//查询文件夹信息
router.get("/getdirs/:index", (req, res) => {
  dbFilesHelp.getDirs(req, res);
});

//查询属于parent下的文件夹列表
router.get("/getdirsofparent/:parentIndex", (req, res) => {
  dbFilesHelp.getDirsOfParentIndex(req, res);
});

//查询属于index下的文件夹和文件列表
router.get("/getdirsandfiles/:parentIndex", (req, res) => {
  dbFilesHelp.getFilesAndDirsOfParentIndex(req, res);
});

//增加文件夹
router.post("/adddir", (req, res) => {
  // console.log("add body", req.body)//必须配置中间件
  // console.log(req)//必须配置中间件
  dbFilesHelp.addDir(req, res);
});

//批量删除文件
router.post("/delfiles", (req, res) => {
  // console.log("add body", req.body)//必须配置中间件
  // console.log(req)//必须配置中间件
  dbFilesHelp.delFiles(req, res);
});

//批量删除文件夹
router.post("/deldirs", (req, res) => {
  // console.log("add body", req.body)//必须配置中间件
  // console.log(req)//必须配置中间件
  dbFilesHelp.delDirs(req, res);
});

//批量删除文件,文件夹
router.post("/delfileanddirs", (req, res) => {
  // console.log("add body", req.body)//必须配置中间件
  // console.log(req)//必须配置中间件
  dbFilesHelp.delFilesAndDirs(req, res);
});

//获取删除的文件,文件夹
router.get("/alldelfileanddirs", (req, res) => {
  dbFilesHelp.getAllDelFilesAndDirs(req, res);
});

//获取指定用户删除的文件,文件夹
router.get("/alldelfileanddirsbyuser/:user", (req, res) => {
  dbFilesHelp.getAllDelFilesAndDirsByUser(req, res);
});

//恢复删除的文件
router.get("/restorefile/:id", (req, res) => {
  dbFilesHelp.restoreFiles(req, res);
});

//恢复删除的 文件夹
router.get("/restoredirs/:index", (req, res) => {
  dbFilesHelp.restoreDirs(req, res);
});

//重命名文件
router.post("/renamefile", (req, res) => {
  // console.log("add body", req.body)//必须配置中间件
  // console.log(req)//必须配置中间件
  dbFilesHelp.reNameFile(req, res);
});

//重命名文件夹
router.post("/renamedir", (req, res) => {
  // console.log("add body", req.body)//必须配置中间件
  // console.log(req)//必须配置中间件
  dbFilesHelp.reNameDir(req, res);
});

//更新文件夹权限
router.post("/updatedirpermissions", (req, res) => {
  // console.log("add body", req.body)//必须配置中间件
  // console.log(req)//必须配置中间件
  dbFilesHelp.UpDateDirPermissions(req, res);
});
module.exports = router;
