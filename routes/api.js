var express = require('express');
var router = express.Router();

/* api. */
router.get('/', function (req, res, next) {
	res.send({
		ok: 0
	});
});

module.exports = router;
