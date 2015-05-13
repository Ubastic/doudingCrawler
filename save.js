var async = require('async');
var db = require('./db_config').db;

//保存第一级分类
exports.classList = function (list, callback) {
	async.eachSeries(list, function (item, next) {
		db.query('SELECT * FROM `classList` WHERE `id` = ? LIMIT 1', [item.id],function (err, data){
			if (err)
				return next(err)
			if (Array.isArray(data) && data.length >= 1) 
			{
				console.log(data);
				db.query('UPDATE `classList` SET `id` = ?, `url` = ?, `title` = ? WHERE `id` = ?', [item.id, item.url, item.title, item.id], next);
			}
			else
			{
				db.query('INSERT INTO `classList`(`id`, `url`, `title`) VALUES(?, ?, ?)', [item.id, item.url, item.title], next);
			}
		});
	}, callback);
}

exports.secondClassList = function(classId, list, callback) {
	async.eachSeries(list, function (item, next) {
		//console.log(item);
		db.query('SELECT * FROM `secondClassList` WHERE `url` = ? LIMIT 1', [item.url], function (err, data) {
			if (err)
				return next(err);
			//console.log(data);
			if (Array.isArray(data) && data.length >= 1)
			{
				db.query('UPDATE `secondClassList` SET `type`= ?, `url` = ?, `title` = ? WHERE `url` = ?', 
					[item.type, item.url, item.title, item.url], next);
			}
			else
			{
				db.query('INSERT INTO `secondClassList`(`type`, `url`, `title`) VALUES(?, ?, ?)', [item.type, item.url, item.title], next);
			}
		});
	}, callback);
}