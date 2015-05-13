var fs = require('fs');
var async = require('async');
var path = process.cwd() + "\\File";

async.waterfall([
	function (done) {
		fs.exists(path, function(args){
			if (args = true)
			{
				done(null);
			}
		})
	},

	function (done) {
		fs.readdir(path, function (err, dirs) {
			if(err) console.error(err.stack);
			console.log(dirs);
			done(null, dirs);
		});
	},

	function (dirs, done) {
		var fileCountList = new Array();
		async.each(dirs, function (dir, next) {
			var fullPath = path + "\\" + dir;
			fs.readdir(fullPath, function (err, files) {
				if(err) console.error(err.stack);
				var temp = {
					dir : dir,
					count : files.length
				}
				fileCountList.push(temp);
				console.log(dir + " : " + files.length);
				next(err);
			});
		}, function (err) {
			done(null, fileCountList);
		});
		//async.parallel(tasks, [callback])
	},

	function (list, done) {
		var total = 0;
		async.each(list, function (l, next) {
			//console.log(l);
			total += l.count;
		});
		console.log("total: " + total);
		done(null);
	}

	], function (err) {
		if(err) console.error(err.stack);
		console.log("ok");
		//console.log(DocumentInfo);
		process.exit(0);
})
