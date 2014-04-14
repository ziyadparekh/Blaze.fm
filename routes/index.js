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
 	var url = "http://localhost:3010";
 	res.render('helix',{url:url});

 }