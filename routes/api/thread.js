'use strict';

var db, _, async, functions;
db = require('../../db');
_ = require('underscore');
async = require('async');
functions = require('../../modules/functions');

exports.broadcast = function(req, res){
	if(!req.body || !req.body.composer || !req.body.body)
		return res.send(500,{error: {message: 'we couldnt publish your post'}});
	if(!req.user || req.user.id == 0)
		return res.send(500,{error: {message: 'You are not logged in'}});
	var done = function(err, post){
		if (!post || err) {
			console.log(err);
			return res.send(404, {
				status: 404,
				response: null,
				error: 'post could not be created.'
			});
		}
		db.thread.render(post.insertId, req, function(err, result){
			if(err)
				console.log(err)
			if(!result)
				return res.send(404,{error: {message: 'No Post Found'}})
			db.users.render(result.receiver, req, function(err, receiver){
				if(err)
					console.log(err)
				result.receiver = receiver;

				db.users.render(result.composer, req, function(err, user){
					if(err)
						console.log(err)
					result.user = user;
					delete result.composer;

					res.send({ status: 200, response: result, error: null });
				})
			})
		})
	}
	db.thread.create(req.body, req, function(err, post){
		if(err)
			console.log(err)
		return done(null, post);
	})
}

exports.feed = function(req, res){
	if(!req.user || req.user.id == 0)
		return res.send(500,{error: {message: 'You are not logged in'}});
	if(!req.params || !req.params.id || req.params.id == 0)
		return res.send(500, {error: {message: 'Not a valid user'}});

	var done = function(err, rows){
	    if(err || !rows || rows.length == 0)
	        return res.send({meta: 200, response: [], error: err});
	    db.thread.fast_render(rows, req, function(err, echo){
	        return res.send({meta: 200, response: echo, error: null});
	    })
	};
	db.thread.getfeed(req, done)

}

exports.remove = function(req, res){
	if(!req.user)
        return res.send({meta: 500, response: null, error: "please log in"})
    if(!req.params || !req.params.id || isNaN(req.params.id)){
        return res.send({meta: 500, response: null, error: "not a valid id"});
    }
    var id = req.params.id
    db.thread.removethread(id, req, function(err, result){
        if(err)
            console.log(err)
        res.send({meta: 200, response: result, error: null})
    })
}