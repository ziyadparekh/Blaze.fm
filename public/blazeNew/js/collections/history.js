define([
	'backbone',
	'app',
	'localstorage',
	], function (Backbone, app, localstorage) {
		"use strict";
		var history = Backbone.Collection.extend({
			localStorage: new Backbone.LocalStorage("History"),
		});

		return history;

	});