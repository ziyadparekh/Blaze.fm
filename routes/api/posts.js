'use strict';

var db, _, async, functions;
db = require('../../db');
_ = require('underscore');
async = require('async');
functions = require('../../modules/functions');

exports.create = function(req, res){
    if(!req.body || !req.body.author || !req.body.title || !req.body.post)
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
        db.posts.render(post.insertId, req, function(err, result){
            if(err)
                console.log(err)
            if(!result)
                return res.send(404,{error: {message: 'No Post Found'}})
            db.users.render(result.author, req, function(err, user){
                if(err)
                    console.log(err)
                result.user = user;
                delete result.author;

                res.send({ status: 200, response: result, error: null });
            })
        })
    }
    db.posts.create(req.body, req, function(err, post){
        if(err)
            console.log(err)
        return done(null, post);
    })
}

exports.find = function(req, res){
    if(!req.params || !req.params.id || isNaN(req.params.id)){
        return res.send({meta: 500, response: null, error: "not a valid id"});
    }
    db.posts.render(req.params.id, req, function(err, result){
        if(err)
            console.log(err)
        if(!result)
            return res.send(404,{error: {message: 'No Post Found'}})
        db.users.render(result.author, req, function(err, user){
            if(err)
                console.log(err)
            result.user = user;
            delete result.author;

            res.send({ status: 200, response: result, error: null });
        })
    })
}

exports.remove = function(req, res){
    if(!req.user)
        return res.send({meta: 500, response: null, error: "please log in"})
    if(!req.params || !req.params.id || isNaN(req.params.id)){
        return res.send({meta: 500, response: null, error: "not a valid id"});
    }
    var id = req.params.id
    db.posts.removepost(id, req, function(err, result){
        if(err)
            console.log(err)
        res.send({meta: 200, response: result, error: null})
    })
}