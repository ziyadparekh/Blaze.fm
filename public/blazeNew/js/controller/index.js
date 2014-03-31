define([
	'app',
	'views/likes',
	'views/history'
	], function (app, Likes, History) {
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
			},
			load_history: function(){
				if(app.headerView.leftmenu){
					app.headerView.leftmenu.close();
				}
				app.historyView = new History({pseudomodel: app.currentSong, collection:app.history})
				app.center.show(app.historyView)
			}

		};
	});