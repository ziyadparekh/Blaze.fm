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

 var anon = {
 	id: 0,
 	name: 'Default Post',
 	curator: 4,
 	description: 'You should never see this',
 	image: ""
 };

 exports.create = function(post, req, done, next){
 	connection.query('INSERT INTO posts SET ?', post, function(err, rows) {
 		if(err)
 			console.log(err);
 		return done(null, rows);
 	}, next)
 };

 exports.render = function(id, req, done, next){
 	var render_post = function (post, req, done, next) {
 		if (!id || isNaN(id) || id == 0) {
 			return done(null, anon);
 		}else {
 			return done(null, post);
 		}
 	};
 	if (id && !isNaN(id)){
 		connection.query('SELECT * FROM posts WHERE id = ? LIMIT 1', id, function(err, result){
 			if (err || !result || !result[0]) {
 				return done('No such post', null);
 			}
 			render_post(result[0], req, done, next);
 		}, next);
 	}else{
 		render_post(id, req, done, next);
 	}
 }

 exports.removepost = function(id, req, done, next){
 	console.log(id)
 	connection.query('DELETE FROM posts WHERE id = ?', id, function(err, rows){
 	    if(err)
 	        console.log(err)
 	    else
 	        return done(null, rows)
 	}, next)
 }