exports.mysql = function(){
        var mysql = require('mysql');
        var connection = mysql.createConnection({
                host     : "localhost",
                user     : "root",
                password : "grindhouse",
                port     : 3306,
                database : "helix"
        });
        connection.connect();
        return connection;
}