'use strict';

/**
 * POSTS model
 * @type {exports}
 */
 var connection = require('../modules/connection');
 var mysql = require('mysql');

 var functions = require('../modules/functions');

 var async = require('async');
 var _ = require('underscore');
 var db = require('../db');

 exports.create = function(post, req, done, next){
 	connection.query('INSERT INTO threads SET ?', post, function(err, rows) {
 		if(err)
 			console.log(err);
 		return done(null, rows);
 	}, next)
 };

 exports.render = function(id, req, done, next){
 	var render_post = function (post, req, done, next) {
 		if (!id || isNaN(id) || id == 0) {
 			return done(null, null);
 		}else {
 			return done(null, post);
 		}
 	};
 	if (id && !isNaN(id)){
 		connection.query('SELECT * FROM threads WHERE id = ? LIMIT 1', id, function(err, result){
 			if (err || !result || !result[0]) {
 				return done('No such post', null);
 			}
 			render_post(result[0], req, done, next);
 		}, next);
 	}else{
 		render_post(id, req, done, next);
 	}
 }

 exports.getfeed = function(req, done, next){
 	connection.query('SELECT * FROM threads WHERE receiver = ? ORDER BY `date` DESC LIMIT 20', req.params.id, function(err, result){
 		console.log(result)
 		if(err)
 			console.log(err)
 		if(!result || !result[0])
 			return done(null, [])
 		return done(null, result)
 	})
 }

 exports.fast_render = function(threads, req, done, next) {
 	async.mapLimit(threads, 5, function(thread, callback){
 		if (!thread || !thread.id || isNaN(thread.id) || thread.id == 0) {
 			return callback(null, []);
 		} else {
 			render(thread, req, callback, next);
 		}
 	}, done);
 };

 var render = function(thread, req, done, next){
 	db.users.render(thread.composer, req, function(err, user){
 		if(err)
 			console.log(err)
 		thread.user = user;
 		delete thread.composer;

 		db.users.render(thread.receiver, req, function(err, receiver){
 			if(err)
 				console.log(err)
 			thread.receiver = receiver;
 			return done(null, thread)
 		}, next)
 	})
 }

 exports.removethread = function(id, req, done, next){
 	console.log(id)
 	connection.query('DELETE FROM threads WHERE id = ?', id, function(err, rows){
 	    if(err)
 	        console.log(err)
 	    else
 	        return done(null, rows)
 	}, next)
 }