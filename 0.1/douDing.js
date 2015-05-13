//douDing.js
var async = require('async');
var superagent = require('superagent');
var cheerio = require('cheerio');
var config = require('./config.json');
var url = require('url');
var db = require('./db.js');

console.log(config.listUrls);
var douDingList = config.listUrls;

superagent.get(douDingList)
	.end(function (err, res) {
		if (err)
		{
			return console.error(err);
		}
		//总的大分类
		var topicUrls = [];
		var $ = cheerio.load(res.text);
		var count = 0;
		$('.fco').each(function (idx, element) {
			var $element = $(element);
			count++;
			var temp = {
				id : count,
				title : $element.text(),
				url  : $element.attr('href')
			}
			var newLink = new db(temp);
			newLink.insertData(function(err, result){
				if (err)
				{
					console.err(err);
				}
			});
			topicUrls.push(temp);
		});
		console.log(count);

	});
