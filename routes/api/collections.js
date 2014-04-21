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
		db.collections.render(collection.insertId, req, function(err, result){
			if(err)
				console.log(err)
			db.users.render(result.curator, req, function(err, user){
				if(err)
					console.log(err)
				result.user = user;
				delete result.curator;

				res.send({ status: 200, response: result, error: null });
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
		db.users.render(result.curator, req, function(err, user){
			if(err)
				console.log(err)
			result.user = user;
			delete result.curator;

			res.send({ status: 200, response: result, error: null });
		})
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
		res.send({
			meta: 200,
			response: result,
			error: null
		});
	});
}