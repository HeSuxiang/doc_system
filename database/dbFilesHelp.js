
const { pgp, db } = require("./db")
//resultInfo.js
const { resultInfo, fileInfo } = require("./resultInfo");


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
}


module.exports = dbFilesHelp