//Module dependencies
var pjson = require('../package.json');

 /**
  * Main server html views
  */
  exports.index = function(req, res){
  	var url = 'http://localhost:3000';
  	res.render('blaze', {url: url});
  }
  exports.blaze = function(req, res){
  	var url = 'http://localhost:3010';
  	res.render('blazeNew', {url: url});
  }
  exports.popchat = function(req, res){
  	var url = 'http://localhost:4000';
  	res.render('popchat',{url:url});
  }
  exports.rte = function(req, res){
  	if(req)
  		var user = JSON.stringify(req.user);
  	var url = "http://localhost:3010";
  	console.log(url);
  	res.render('helix',{url:url, user: user});
  }
  exports.login = function(req, res){
  	var url = "http://localhost:3010";
  	res.render('login', {url: url});
  }
  exports.logout = function(req, res){
  	if(req && req.user && req.user.id){
  		req.session.destroy();
  		res.redirect('/login');
  	}else
  		res.redirect('/login');
  };
  exports.status = function(req, res){
  	res.send({meta: 200,
  		response: {
  			name: process.env.DB_NAME+"-web",
  			status: "ok",
  			message: "All systems go!",
  			version: pjson.version,
  		},
  		error: null
  	});
  };
  exports.notfound = function(req, res) {
  	return res.send(404, {meta: 404, response: null, error: 'Not found: '+req.originalUrl+ ' is not a valid endpoint'});
  };