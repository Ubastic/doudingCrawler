var mysql = require('mysql');

exports.db = mysql.createConnection({
	host       :     '127.0.0.1',
	user       :     'root',
	password   :     '123456',
	database   :     'douding'
});

exports.doudingUrl = {
	url : 'http://www.docin.com/list.html'
};