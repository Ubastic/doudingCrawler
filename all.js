var async = require('async');
var config = require('./db_config.js');
var read = require('./read');
var save = require('./save');

var classList;
var secondClassList = {};
var DocumentInfo = new Array();

async.series([
	//获取第一级分类
	function (done) {
		read.classList(config.doudingUrl.url, function(err, list) {
			classList = list;
			done(err);
		});
	},

	function (done) {
		save.classList(classList, done);
	},

	//获取第二级分类
	function (done) {
		async.eachSeries(classList, function (c, next) {
			read.secondClassList(c.url, c.id, function (err, list) {
				secondClassList[c.id] = list;
				console.log(secondClassList);
				next(err);
			});
		}, done);
	},

	function (done) {
		async.eachSeries(Object.keys(secondClassList), function (classId, next) {
			save.secondClassList(classId, secondClassList[classId], next);
		}, done);
	},

	//获得文章的documentId
	function (done) {
		async.eachSeries(Object.keys(secondClassList), function (classId, next) {
			async.eachSeries(secondClassList[classId], function (item, next) {
				console.log(classId + item.title);
				var subType = item.title;
				if (classId == 1){
					var DocumentList= new Array();
					var tempArray = item.url.split('.');
					var aimElem = tempArray.length - 2;
					tempArray[aimElem] = tempArray[aimElem].substring(0, tempArray[aimElem].length - 3);
					var temp = tempArray[aimElem];
					//console.log(temp);
					for (var i = 1; i <= 20; i++)
					{
						tempArray[aimElem] = temp + '2-' + i;
						DocumentList.push(tempArray.join('.'));
					}
					console.log(DocumentList);
					async.eachSeries(DocumentList, function (url, next) {
						console.log("classId: " + classId);
						read.getDocumentInfo(url , subType, function(err, list) {
							DocumentInfo.push(list);
							console.log(DocumentInfo);
							next(err);
						});
					}, next);
				}
				else
				{
					next();
				}
			}, next);
		}, done);
	},
/*	function (done) {
		async.eachSeries(secondClassList[1], function (item, next) {
			if (item.title == '星座运势宗教风水')
				{
					read.getDocumentInfo(item , function(err, list) {
					DocumentInfo.push(list);
					console.log(DocumentInfo);
					next(err);
					});
				}
				else
				{
					next();
				}
		}, done);
	},*/

	function (done) {
		async.eachSeries(Object.keys(DocumentInfo), function (id, next) {
			async.eachSeries(DocumentInfo[id], function(d, next) {
				console.log("d................" + d.title);
				read.getFileName(d.href, d.subType, function (err, list) {
					//console.log(secondClassList);
					next(err);
				});
			}, next);
		}, done);
	}

], function (err) {
	if(err) console.error(err.stack);
	console.log("ok");
	//console.log(DocumentInfo);
	process.exit(0);
});