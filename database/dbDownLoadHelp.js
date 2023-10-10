const { pgp, db } = require("./db");
const path = require("path");
const fs = require("fs");

const dbDownLoadHelp = {
  // 下载文件
  downFile: (req, res) => {
    // console.log("dbDownLoadHelp downFile  req.params", req.params)

    const year = req.params.year;
    const md5 = req.params.md5;
    const filename = req.params.filename;
    const name = req.params.name;

    // 获取文件路径
    const filePath = path.join(
      __dirname,
      "../uploads/" + year + "/" + filename
    );
    console.log("downFile filePath", filePath);

    // var stats = fs.statSync(filePath);
    // if (stats.isFile()) {
    // 	res.set({
    // 		'Content-Type': 'application/octet-stream',
    // 		'Content-Disposition': 'attachment; filename=' + encodeURIComponent(name),
    // 		'Content-Length': stats.size
    // 	});
    // 	console.log("downFile + encodeURIComponent(name)", encodeURIComponent(name));
    // 	fs.createReadStream(filePath).pipe(res);
    // } else {
    // 	res.end(404);
    // }

    // 作者：ahabhgk
    // 链接：https://juejin.cn/post/6844903794178785294
    // 来源：稀土掘金
    // 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

    try {
      // console.log("downFile try exist");
      var exist = fs.existsSync(filePath);
      console.log("downFile filePath exist", exist);
      if (exist) {
        // console.log("downFile filePath exist", exist);
        // res.download(filePath);
        const size = fs.statSync(filePath).size;
        res.writeHead(200, {
          // 告诉浏览器这是一个需要以附件形式下载的文件（浏览器下载的默认行为，前端可以从这个响应头中获取文件名：前端使用ajax请求下载的时候，后端若返回文件流，此时前端必须要设置文件名-主要是为了获取文件后缀，否则前端会默认为txt文件）
          "Content-Disposition":
            "attachment; filename=" + encodeURIComponent(name),
          // 告诉浏览器是二进制文件，不要直接显示内容
          "Content-Type": "application/octet-stream",
          // 下载文件大小
          "Content-Length": size,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "X-Requested-With",
          "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
          //如果不暴露header，那就Refused to get unsafe header "Content-Disposition"
          "Access-Control-Expose-Headers": "Content-Disposition",
        });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.json({ success: 1, error: "目标文件不存在" });
      }
    } catch (err) {
      res.send({
        status: 201,
        mmessage: "try error",
        err: err,
      });
      return;
    }
    // 作者：liuzhen007
    // 链接：https://juejin.cn/post/6994811553224753159
    // 来源：稀土掘金
    // 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

    // try {
    // 	console.log("downFile try exist");
    // 	// fs.readFile 和 fs.writeFile有内存限制问题，下载大文件时，会提示"ERR_FS_FILE_TOO_LARGE"，因此大文件采用createReadStream
    // 	fs.readFile(filePath, (err, data) => {
    // 		if (err) {
    // 			res.send({
    // 				status: 201,
    // 				message: filePath,

    // 			});
    // 			return;
    // 		}
    // 		// 获取文件大小
    // 		const size = fs.statSync(filePath).size;
    // 		res.writeHead(200, {
    // 			// 告诉浏览器这是一个需要以附件形式下载的文件（浏览器下载的默认行为，前端可以从这个响应头中获取文件名：前端使用ajax请求下载的时候，后端若返回文件流，此时前端必须要设置文件名-主要是为了获取文件后缀，否则前端会默认为txt文件）
    // 			'Content-Disposition': 'attachment; filename=' + encodeURIComponent(name),
    // 			// 告诉浏览器是二进制文件，不要直接显示内容
    // 			'Content-Type': 'application/octet-stream',
    // 			// 下载文件大小
    // 			'Content-Length': size,
    // 			'Access-Control-Allow-Origin': '*',
    // 			'Access-Control-Allow-Headers': 'X-Requested-With',
    // 			'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
    // 			//如果不暴露header，那就Refused to get unsafe header "Content-Disposition"
    // 			"Access-Control-Expose-Headers": 'Content-Disposition'
    // 		});
    // 		fs.createReadStream(filePath).pipe(res);
    // 	})
    // } catch (err) {
    // 	res.send({
    // 		status: 201,
    // 		mmessage: "try error",
    // 		err: err
    // 	})
    // 	return;
    // }
  },

  // 预览接口下载文件
  previewFile: (req, res) => {
    // console.log("dbDownLoadHelp downFile  req.params", req.params)

    const year = req.params.year;
    const md5 = req.params.md5;
    const filename = req.params.filename;

    // 获取文件路径
    const filePath = path.join(
      __dirname,
      "../uploads/" + year + "/" + filename
    );

    // console.log("previewFile filename", filename);
    // console.log("previewFile filePath", filePath);

    try {
      // console.log("downFile try exist");
      var exist = fs.existsSync(filePath);
      // console.log("downFile filePath exist", exist);
      if (exist) {
        // console.log("downFile filePath exist", exist);
        // res.download(filePath);
        const size = fs.statSync(filePath).size;
        res.writeHead(200, {
          // 告诉浏览器这是一个需要以附件形式下载的文件（浏览器下载的默认行为，前端可以从这个响应头中获取文件名：前端使用ajax请求下载的时候，后端若返回文件流，此时前端必须要设置文件名-主要是为了获取文件后缀，否则前端会默认为txt文件）
          "Content-Disposition":
            "attachment; filename=" + encodeURIComponent(filename),
          // 告诉浏览器是二进制文件，不要直接显示内容
          "Content-Type": "application/octet-stream",
          // 下载文件大小
          "Content-Length": size,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "X-Requested-With",
          "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
          //如果不暴露header，那就Refused to get unsafe header "Content-Disposition"
          "Access-Control-Expose-Headers": "Content-Disposition",
        });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.json({ success: 1, error: "目标文件不存在" });
      }
    } catch (err) {
      res.send({
        status: 201,
        mmessage: "try error",
        err: err,
      });
      return;
    }
  },
};

module.exports = dbDownLoadHelp;
