'use strict';

/**
 * COLLECTIONS model
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
 	name: 'Default Collection',
 	curator: 4,
 	description: 'You should never see this',
 	image: ""
 };

 exports.render = function(id, req, done, next){
 	var render_collection = function (collection, req, done, next) {
 		if (!id || isNaN(id) || id == 0) {
 			return done(null, anon);
 		}else {
 			return done(null, collection);
 		}
 	};
 	if (id && !isNaN(id)){
 		connection.query('SELECT * FROM collections WHERE id = ? LIMIT 1', id, function(err, result){
 			if (err || !result || !result[0]) {
 				return done('No such collection', null);
 			}
 			render_collection(result[0], req, done, next);
 		}, next);
 	}else{
 		render_collection(id, req, done, next);
 	}
 }
 exports.create = function(post, req, done, next){
 	connection.query('INSERT INTO collections SET ?', post, function(err, rows) {
 		if(err)
 			console.log(err);
 		console.log(rows);
 		return done(null, rows);
 	}, next)
 };

 exports.findByTitle = function(title, done, next) {
     connection.query('SELECT * FROM collections WHERE LOWER(name) = ? LIMIT 1', title, function(err, rows) {
         if(!err && rows[0])
             return done(null, rows[0]);
         else
             return done(null, null);
     }, next);
 };

 exports.search = function(title, done, next) {
     connection.query('SELECT * FROM collections WHERE LOWER(name) LIKE ? LIMIT 1', [title+'%'], function(err, rows) {
         if(!err && rows[0])
             return done(null, rows[0]);
         else
             return done(null, null);
     }, next);
 };
exports.update = function(body, done, next){
    connection.query('UPDATE collections SET ? WHERE id = ?', [body, body.id], function(err, result){
        if(err)
            return done(err)
        else{
            console.log(result)
            return done(null, "update successful")
        }
    })
}