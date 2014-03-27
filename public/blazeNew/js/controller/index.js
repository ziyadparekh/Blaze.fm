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
				if(app.headerView.leftmenu){
					console.log(app.headerView.leftmenu);
					app.headerView.leftmenu.close();
				}
				app.likesView = new Likes({pseudomodel: app.currentSong, collection:app.favorites})
				app.center.show(app.likesView)
			}

		};
	});