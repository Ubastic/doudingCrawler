var mysql = require('mysql');
var config = require('./config.json');

console.log(config.database.password);
console.log(config.database.dbname);

var pool = mysql.createPool({
	host       :     '127.0.0.1',
	user       :     'root',
	password   :     '123456',
	database   :     'douding'
});

function Links(links) {
	this.id = links.id;
	this.title = links.title;
	this.url = links.url;
}

pool.getConnection(function(err, connection) {

	if (err)
	{
		return console.error(err);
	}

	console.log("success connect to database");

	Links.prototype.selectAllLinks = function selectAllLinks(callback) {

		var select_Sql = 'select * from firstlevellist';
		connection.query(select_Sql, function(err, result) {
            if (err) {
                console.log("select_Sql Error: " + err.message);
                return;
            }

            //connection.release();
            callback(err, result);
        });
	};

	Links.prototype.insertData = function insertData(callback) {

		var links = {
			id : this.id,
			title: this.title,
			url: this.url
		}

		var insert_Sql = 'Insert into firstlevellist(id, title, url) values(?, ? ,?)';
		connection.query(insert_Sql, [links.id, links.title, links.url], function(err, result) {
            if (err) {
                console.log("insert_Sql Error: " + err.message);
                return;
            }

            //connection.release();
            callback(err, result);
        });
	};
})

module.exports = Links;