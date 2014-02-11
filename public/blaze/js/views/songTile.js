define(['app',
	'marionette',
	'templates',
	'soundmanager2'], function (App, Marionette, templates, soundManager) {
		"use strict";

		return Backbone.View.extend({
			initialize: function(){

			},
			events:{
				'click .remix' : 'change_version',
			},
			render: function(){

			},
			change_version: function(e){
				$(".remix").removeClass("active");
				$(e.currentTarget).addClass("active");
				var id = $(e.currentTarget).children("a").attr("id");
				var title = $(e.currentTarget).children("a").text();
				var image = $(e.currentTarget).children("img").attr("src");
				song.trackName = title;
				song.id = id;
				song.src = image;
				Backbone.trigger("Version");
			},

		});

	});