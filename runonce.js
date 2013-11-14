var mysql      = require('mysql');

var mysql = require('mysql');
var MYSQL_USERNAME = 'root';
var MYSQL_PASSWORD = 'password';

var connection = mysql.createConnection({
	host     : "localhost",
	user     : "root",
	password : "grindhouse",
	port     : 3306,
	database : "helix"
});

var query = 'CREATE TABLE users(uid int, first_name varchar(255), last_name varchar(255))';
connection.query(query, function(err, results){
	if (err) {
		throw err;
	}else{
		console.log("Table users created");
	}
});
var query = 'INSERT INTO users (uid, first_name, last_name) VALUES (NULL, "Ziyad", "Parekh")';
connection.query(query, function(err, results){
	if(err){
		throw err
	}else
	console.log("success");
})