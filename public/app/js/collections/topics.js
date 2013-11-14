define([
	'backbone',
	'models/topic',
	'app',
	'templates'
	], function (Backbone, topic, app, templates) {
		"use strict";
		return Backbone.Collection.extend({
			model: topic
		});

	});