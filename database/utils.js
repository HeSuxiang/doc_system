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

var fileInfo = function (filename, originalname, dirindex, upuser, uptime, size, pathyear, mimetype, md5) {
	filename = filename || "";
	originalname = originalname || "";
	dirindex = dirindex || "";
	upuser = upuser || "";
	uptime = uptime || 0;
	size = size || 0;
	pathyear = pathyear || "";
	mimetype = mimetype || "";
	md5 = md5 || "";

	var obj = {
		filename: filename,
		originalname: originalname,
		dirindex: dirindex,
		upuser: upuser,
		uptime: uptime,
		size: size,
		pathyear: pathyear,
		mimetype: mimetype,
		md5: md5,
	};
	return obj;
};

function getdate() {
	var now = new Date(),
		y = now.getFullYear(),
		m = now.getMonth() + 1,
		d = now.getDate();
	return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
}

function getTime() {
	let myDate = new Date()
	let year = myDate.getFullYear();   //获取系统的年；
	let Month = myDate.getMonth() + 1;
	let day = myDate.getDate(); // 获取系统日，
	let hour = myDate.getHours(); //获取系统时，
	let minute = myDate.getMinutes(); //分
	let second = myDate.getSeconds(); //秒

	if (Month < 10) {
		Month = '0' + Month
	}
	if (day < 10) {
		day = '0' + day
	}

	if (hour < 10) {
		hour = '0' + hour
	}
	if (minute < 10) {
		minute = '0' + minute
	}
	if (second < 10) {
		second = '0' + second
	}

	return year + '' + Month + '' + day + '-' + hour + '' + minute + '' + second

}
//token 
const jwt = require("jsonwebtoken")
const secret = "doc-system"
const JWT = {
	generate(value, expires) {
		return jwt.sign(value, secret, { expiresIn: expires })
	},

	verify(token) {
		try {
			return jwt.verify(token, secret)
		} catch (error) {
			return false
		}
	}
}


module.exports = { resultInfo, fileInfo, getdate, getTime }; 