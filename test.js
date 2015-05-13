var superagent = require('superagent');
var async = require('async');
var fs = require('fs');

var cTime = + new Date();
var header = { 'Host': 'www.docin.com',
'Connection': 'keep-alive',
'Pragma': 'no-cache',
'Cache-Control': 'no-cache',
'Accept': 'text/html, */*; q=0.01',
'X-Requested-With': 'XMLHttpRequest',
'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.94 Safari/537.36',
'Referer': 'http://www.docin.com/p-34742598.html',
'Accept-Encoding': 'gzip, deflate, sdch',
'Accept-Language': 'zh-CN,zh;q=0.8',
'Cookie': 'docin_session_id=cdad5df8-a4e8-42cb-88d4-df9493de3792;'
	+'cookie_id=C6985838062000011E5B1DFA1836FF10;' 
	+'time_id=201554105127;' 
	+'pgv_pvi=1230170112; alert_dcwj=10069166_0; login_email=weefic;' 
	+ 'user_password=8aI4yS3g%2Bo5bExlONcGLVJzXYrLrV6bvH_TIH2JgudPEsdGy7cO1GECtRBFRGhfUjX4vF72cQlRjmzmdidmHSufoA%3D%3D;'
	+ 'login_info_name=weefic; login_info_pwd=8aI4yS3g%2Bo5bExlONcGLVJzXYrLrV6bvH_TIH2JgudPEsdGy7cO1GECtRBFRGhfUjX4vF72cQlRjmzmdidmHSufoA%3D%3D;'
	+ 'bdshare_firstime=1430730739726; buy_type_649280308=0; buy_type_1068075347=0; buy_type_1048575747=0; mobilefirsttip=tip; buy_type_746511993=0;'
 	+ 'buy_type_47334703=0; buy_type_830473=0; notip=notip; buy_type_356785019=0; welcometipshow=-1; ifshowadvertising=1;'
	+ 'refererfunction=https%3A%2F%2Fwww.baidu.com%2Flink%3Furl%3DwOD6yYHYdkoDjS0q2fjTv7au9YPz5LXlKEVBfV00i8m%26ie%3DUTF-8%26wd%3Ddouding;'
 	+ 'vip_from10069166=9; jumpIn=400; buy_type_818803310=0; userchoose=usertags102_104_129_105_000_; buy_type_363345999=0; buy_type_160766251=0;'
  	+ 'buy_type_52065985=0; buy_type_988205291=0; buy_type_511771998=0; saveFinProductToCookieValue=1119671225; buy_type_1119671225=0; '
  	+ 'buy_type_34841452=0; buy_type_13090790=0; netfunction=/app/browse/list; buy_type_42812167=0; buy_type_47746159=0; buy_type_8664457=0;'
  	+ '_ga=GA1.2.1051899265.1430707890; JSESSIONID=9265074E7B1A492F8555EFD8E02C3DC7-n2; buy_type_34742598=0'}
var getDownUrl = function (callback) {
	superagent.get(url)
		.set(header)
		.end(function (err, res){
			var result = res.text;
			var temp = result.split('|');
			var rtUrl = temp[1];
			console.log(rtUrl);
			callback(null, rtUrl);
		})
}

var parseUrl = function (url) {
	var indexPara = url.indexOf('?');
	if (indexPara == -1) return;
	var queryStr = url.substr(indexPara + 1);
	var arr1 = queryStr.split('&');
	var obj = {};
	for (i in arr1)
	{
		var temp = arr1[i].split('=');
		obj[temp[0]] = temp[1];
	}
	return obj;
}

var downFreeFile = function (urlbf, callback) {
	var tempUrl = decodeURIComponent(urlbf,'UTF-8');
	var obj = parseUrl(tempUrl);
	var ext = obj.extname;
	var fname = decodeURI(obj.filename);
	var key = obj.key;
	var path = process.cwd() + "\\File\\" + fname;
	var getUrl = urlbf;
	console.log(getUrl);
	fs.exists(path, function(args){
		if (args == true)
		{
			callback(null);
		}
		else
		{
			console.log(path);
			var stream = fs.createWriteStream(path);
			var req = superagent.get(getUrl)
							.end(function (err, res){
								if (err)
									console.error(err);
								console.log(res);
							});
			req.pipe(stream).on('data', function (err) {
				
			});
			req.pipe(stream).on('finish', function (err) {
				if (err)
				{
					console.error(err);
				}
				callback(null);
			});
		}
	});
}


var tasks = [getDownUrl, downFreeFile];
var getFreeFile = function (documentId, callback) {
	url = "http://www.docin.com/newEnd/down_load_new_v1.do?"
		+ "pid=" + documentId 
		+ "&fn=&flag=down&"
		+ "datetime=" + cTime;
	async.waterfall(tasks, function (err) {
		if(err) console.error(err.stack);
		console.log("download ok");
		callback();
	});
}

getFreeFile(33632454, function(){

});