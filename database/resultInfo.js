//定义统一接口返回格式
var resultInfo = function (code, data, msg) {
	code = code || false;
	data = data || [];
	msg = msg || "";
	//这边采用的是首字母大写，具体返回哪种格式可以自定义
	var obj = {
		Code: code,
		Data: data,
		Message: msg,
	};
	return obj;
};

module.exports = resultInfo;