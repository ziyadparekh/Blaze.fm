/**
 * Main server html views
 */
 exports.index = function(req, res){
 	var url = 'http://localhost:3000';
    res.render('app', {url: url});
  }