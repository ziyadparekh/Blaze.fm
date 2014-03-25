define([
	'backbone',
	'app',
	'localstorage',
	], function (Backbone, app, localstorage) {
		"use strict";
		var favorites = Backbone.Collection.extend({
			localStorage: new Backbone.LocalStorage("Favorites"),
		});

		return favorites;

	});