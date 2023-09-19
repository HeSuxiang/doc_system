//定义统一接口返回格式
var resultInfo = function (code, data, msg) {
	code = code || false;
	data = data || [];
	msg = msg || "";
	//这边采用的是首字母大写，具体返回哪种格式可以自定义
	var obj = {
		code: code,
		data: data,
		message: msg,
	};
	return obj;
};

var fileInfo = function (filename, originalname, dirindex, upuser, uptime, size, path, mimetype, md5) {
	filename = filename || "";
	originalname = originalname || "";
	dirindex = dirindex || "";
	upuser = upuser || "";
	uptime = uptime || 0;
	size = size || 0;
	path = path || "";
	mimetype = mimetype || "";
	md5 = md5 || "";

	var obj = {
		filename: filename,
		originalname: originalname,
		dirindex: dirindex,
		upuser: upuser,
		uptime: uptime,
		size: size,
		path: path,
		mimetype: mimetype,
		md5: md5,
	};
	return obj;
};

module.exports = { resultInfo, fileInfo };