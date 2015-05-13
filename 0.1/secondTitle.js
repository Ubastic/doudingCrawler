//douDing.js
var superagent = require('superagent');
var cheerio = require('cheerio');
var config = require('./config.json');
var url = require('url');
var Links = require('./db.js');

var douDingList = config.listUrls;


Links.selectAllLinks(function(err, result){
	if (err)
	{
		console.err(err);
	}
	console.log(result);
});