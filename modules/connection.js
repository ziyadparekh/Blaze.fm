exports.mysql = function(){
        var mysql = require('mysql');
        var connection = mysql.createConnection({
                host     : "blaze.c3yptlhkvjtk.us-west-2.rds.amazonaws.com",
                user     : "blaze",
                password : "ziyadfm1",
                port     : 3306,
                database : "helix"
        });
        connection.connect();
        return connection;
}