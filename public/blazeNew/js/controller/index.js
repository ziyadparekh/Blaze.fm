define([
	'app',
	'views/likes'
	], function (app, Likes) {
		"use strict";

		return {
			load_modules: function(){
				console.log("loaded")
			},
			load_favorites: function(){
				app.center.show(new Likes({pseudomodel: app.currentSong, collection:app.favorites}))
			}

		};
	});