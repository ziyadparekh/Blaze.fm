'use strict';

var db, _, async, functions;
db = require('../../db');
_ = require('underscore');
async = require('async');
functions = require('../../modules/functions');

exports.show = function(req, res) {
    if (!req.params.id) {
        return res.send(500, {
            status: 500,
            response: null,
            error: 'No user id provided.'
        });
    }
    var done = function(err, user) {
        if (!user || err) {
            console.log(err);
            return res.send(404, {
                status: 404,
                response: null,
                error: 'Invalid user id.'
            });
        }
        res.send({ status: 200, response: user, error: null });
    };
    db.users.render(req.params.id, req, done);
};