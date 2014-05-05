"use strict"

var db, _, async, functions;
db = require('../../db');
_ = require('underscore');
async = require('async');
functions = require('../../modules/functions');

exports.create = function(req, res){
	var title = req.body.name;
	if(title.length < 3)
		return res.send(500,{error: {message: 'title is too short'}});
	if(!req.user || req.user.id == 0)
		return res.send(500,{error: {message: 'You are not logged in'}});
	var done = function(err, collection){
		if (!collection || err) {
			console.log(err);
			return res.send(404, {
				status: 404,
				response: null,
				error: 'collection could not be created.'
			});
		}
		var post = {
			'uid': req.user.id,
			'cid': collection.insertId
		}
		db.collections.follow(post, req, function(err, rows){
			if(err)
				console.log(err);
			db.collections.render(collection.insertId, req, function(err, result){
				if(err)
					console.log(err)
				if(!result)
					return res.send(404,{error: {message: 'No Collection Found'}})
				db.users.render(result.curator, req, function(err, user){
					if(err)
						console.log(err)
					result.user = user;
					delete result.curator;

					res.send({ status: 200, response: result, error: null });
				})
			})
		})
		
	}
	db.collections.create(req.body, req, function(err, collection){
		if(err)
			console.log(err);
		console.log(collection);
		return done(null, collection);
	});
}

exports.find = function(req, res){
	if(!req.params || !req.params.id || isNaN(req.params.id)){
		return res.send({meta: 500, response: null, error: "not a valid id"});
	}
	db.collections.render(req.params.id, req, function(err, result){
		if(err)
			console.log(err)
		if(!result)
			return res.send(404,{error: {message: 'No Collection Found'}})
		db.users.render(result.curator, req, function(err, user){
			if(err)
				console.log(err)
			result.user = user;
			delete result.curator;
			var post = {
				'uid':user.id,
				'cid': req.params.id
			}
			db.collections.doIfollow(post, req, function(err, rows){
				if(rows.length == 0){
					result.following = false;
					res.send({ status: 200, response: result, error: null });
				}else{
					result.following = true;
					res.send({ status: 200, response: result, error: null });
				}
			})
		})
	})
}
exports.update = function(req, res){
	if(!req.body || !req.body.id)
		return res.send({meta: 200, response: false, error: null})
	if(!(req.body.user.id == req.user.id))
		return res.send({meta: 300, response: "You are not authorized to comlpete this action", error: null})

	delete req.body.button;
	delete req.body.user;
	delete req.body.mid;
	delete req.body.following;

	db.collections.update(req.body, function(err, result){
		if(err)
			console.log(err)
		res.send({meta: 200, response: result, error: null})
	})
}

exports.titleAvailable = function(req, res){
	console.log(req);
	if (!req.query.title || req.query.title.length < 4) {
		return res.send({meta: 200, response: false, error: null});
	}
	db.collections.findByTitle(req.query.title, function(err, result) {
		res.send({
			meta: 200,
			response: result ? false : true,
			error: null
		});
	});
}

exports.search = function(req, res){
	console.log(req);
	if (!req.query.title || req.query.title.length < 4) {
		return res.send({meta: 200, response: false, error: null});
	}
	db.collections.search(req.query.title, function(err, result) {
		if(err)
			console.log(err)
		if(!result)
			return res.send(404,{error: {message: 'No Collection Found'}})
		db.users.render(result.curator, req, function(err, user){
			if(err)
				console.log(err)
			result.user = user;
			delete result.curator;
			var post = {
				'uid':user.id,
				'cid': result.id
			}
			db.collections.doIfollow(post, req, function(err, rows){
				if(rows.length == 0){
					result.following = false;
					res.send({ status: 200, response: result, error: null });
				}else{
					result.following = true;
					res.send({ status: 200, response: result, error: null });
				}
			})
		})
	});
}

exports.follow = function(req, res){
	console.log(req.params);
	if(!req.user)
		return res.send({meta: 500, response: null, error: "please log in"})
	if(!req.params || !req.params.id || isNaN(req.params.id)){
		return res.send({meta: 500, response: null, error: "not a valid id"});
	}
	var post = {
		'uid':req.user.id,
		'cid': req.params.id
	};
	db.collections.doIfollow(post, req, function(err, result){
		console.log(result)
		if(result.length == 0){
			db.collections.follow(post, req, function(err, result){
				if(err)
					console.log(err)
				res.send({meta: 200, response: result, error: null})
			})
		}else{
			console.log(result)
			res.send({meta: 200, response:"you are already following this collection", error: null})
		}
	})
}
exports.unfollow = function(req, res){
	if(!req.user)
		return res.send({meta: 500, response: null, error: "please log in"})
	if(!req.params || !req.params.id || isNaN(req.params.id)){
		return res.send({meta: 500, response: null, error: "not a valid id"});
	}
	var post = {
		'uid':req.user.id,
		'cid': req.params.id
	};
	db.collections.unfollow(post, req, function(err, result){
		if(err)
			console.log(err)
		res.send({meta: 200, response: result, error: null})
	})
}

exports.followed = function(req, res){
	if(!req.user)
		return res.send({meta: 500, response: null, error: "please log in"})
	var done = function(err, rows){
	    if(err || !rows || rows.length == 0)
	        return res.send({meta: 200, response: [], error: err});
	    db.collections.fast_render(rows, req, function(err, echo){
	        return res.send({meta: 200, response: echo, error: null});
	    })
	};
	db.collections.fetchFollowed(req, done)

}