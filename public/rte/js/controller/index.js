define([
	'app',
	'views/editor'
	], function (app, Editor) {
		"use strict";

		return {
			load_main: function(){
				app.center.show(new Editor())
				console.log("loaded")
			}

		};
	});