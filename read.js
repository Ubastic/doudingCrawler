var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
var fileDw = require('./getFile');
var freeFile = require('./getFreeFile');

//第一级列表
exports.classList = function (url, callback) {
	superagent.get(url)
	.end(function (err, res) {
		if (err)
		{
			return console.error(err);
		}
		var topicUrls = [];
		console.log(res.type);
		var $ = cheerio.load(res.text);
		var count = 0;
		$('.fco').each(function (idx, element) {
			var $element = $(element);
			count++;
			var url = $element.attr('href');
			if (url.indexOf('http') == -1)
			{
				url = "http://www.docin.com" + url;
			}
			var temp = {
				id : count,
				title : $element.text(),
				url  : url
			}
			topicUrls.push(temp);
		});
		console.log(count);
		callback(null, topicUrls);
	});
}

//第二级列表
exports.secondClassList = function (url, type, callback) {
	superagent.get(url)
	.end(function (err, res) {
		if (err)
		{
			return console.error(err);
		}
		//总的大分类
		console.log(url);
		var topicUrls = [];
		var $ = cheerio.load(res.text);
		var count = 0;
		$('div.col ul').slice(0,1).each(function (idx, element) {
			var $element = $(element);
			var length = $element[0].children.length;
			for (var i = 0; i < length; i++) {
				if ($element[0].children[i].name == "li")
				{
					count++;
					var children = $element[0].children[i].children;	
					for (var j = 0; j < children.length; j++) {
						if (children[j].type = 'tag' && children[j].name == 'a') 
						{
							var temp = {
								type : type,
								title : children[j].attribs['title'],
								url : children[j].attribs['href']
							}
							topicUrls.push(temp);
						}
					}
				}
			}
		});
		console.log(count);
		callback(null, topicUrls);
	});
}

exports.getDocumentInfo = function (url, subType, callback) {
	superagent.get("http://www.docin.com" + url)
		.end(function (err, res) {
			if (err)
			{
				console.error(err);
			}
			var DocumentInfo = [];
			var $ = cheerio.load(res.text);
			count = 0;
			$('.goToDocs').each(function (idx, element){
				var $element = $(element);
				var title = $element.attr('title');
				var href = $element.attr('href');
				var temp = {
					subType : subType,
					title : title,
					href : href
				};
				DocumentInfo.push(temp);
				//console.log(element);
				//console.log(DocumentInfo);
				count++;
			});
			callback(null, DocumentInfo);
		});
}

exports.getInvoiceId = function(documentUrlId, callback) {
	var tempDm = documentUrlId.split('.');
	var tempAf = tempDm[0].split('-');
	var documentId = tempAf[1];
	fileDw.getFile(documentId, function (){
		callback(null);
	});
}

exports.getFileName = function(documentUrlId, subType, callback) {
	var tempDm = documentUrlId.split('.');
	var tempAf = tempDm[0].split('-');
	var documentId = tempAf[1];
	freeFile.getFreeFile(documentId, subType, function (){
		callback(null);
	});
}