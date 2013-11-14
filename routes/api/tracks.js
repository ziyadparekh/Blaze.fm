var connection = require('../../modules/connection').mysql();
var mysql = require('mysql');
exports.show = function(req, res){
	var sql    = 'SELECT * FROM users';
	connection.query(sql, function(err, results) {
		res.send(results);
	});
}


exports.create = function(req, res){
	var query = req.body.query;
	var id = req.body.id;
	var q = connection.query("SELECT track FROM tracks WHERE track = ?", query, function(err,result){
		if(result.length == 0){
			connection.query("INSERT INTO tracks (track, sc_id) VALUES ("+mysql.escape(query)+", "+mysql.escape(id)+")", null, function(err, results){
				if(err)
					throw err;
				else
					res.send("Thanks for improving our service!");
			})
		}else{
			res.send("We already have the correct track")
		}
	})
}

exports.list = function(req, res){
	var search = "";
	console.log(req.query.query);
	connection.query("SELECT sc_id FROM tracks WHERE track = ?",req.query.query, function(err, results) {
		if(results)
			res.send(results);
		else
			res.send("none");
	});
}

exports.get = function(req, res){
	console.log(req.query);
}


exports.edit = function(req, res){
	console.log(req.query);
}

exports.remove = function(req, res){
	console.log(req.query);
}
