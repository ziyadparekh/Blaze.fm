define(['app',
	'marionette',
	'templates',
	'views/songs',
	'views/artist',
	'views/video'], function (App, Marionette, templates, Songs, Artist, Video) {
		"use strict";

		return Backbone.Marionette.ItemView.extend({
			initialize: function(){

			},
			template: templates.leftzone,
			events:{
				'click .songs' : "load_songs",
				'click .artist' : "load_artist",
				'click .album' : "load_album",
				'click .video' : "load_video"
			},
			onRender: function(){
				this.load_songs();
				$("#center_column").animate({"opacity":1},200);
			},
			load_songs: function(){
				var that = this;
				$(".containers").hide();
				this.containers_open = 'songs';
				$("#songContainer").show();
				$(".list li").removeClass("active");
				$(".songs").addClass("active");
				if(this.songs_init)
					return;
				this.songs_init = true;
				var songs = Backbone.Model.extend();
				var model = new songs({});
				this.songsView = new Songs({model: model, el: $("#songContainer")});
				this.songsView.render();
			},
			load_artist: function(e){
				var that = this;
				$(".containers").hide();
				this.containers_open = 'artist';
				$("#artistContainer").show();
				$(".list li").removeClass("active");
				$(".artist").addClass("active");
				if(this.artist_init)
					return;
				this.artist_init = true;
				var artist = Backbone.Model.extend();
				var model = new artist({});
				this.artistView = new Artist({model: model, el: $("#artistContainer")});
				this.artistView.render();
			},
			load_album: function(e){
				alert();
			},
			load_video: function(e){
				var that = this;
				$(".containers").hide();
				this.containers_open = 'video';
				$("#videoContainer").show();
				$(".list li").removeClass("active");
				$(".video").addClass("active");
				if(this.video_init)
					return;
				this.video_init = true;
				var video = Backbone.Model.extend();
				var model = new video({});
				this.videoView = new Video({model: model, el: $("#videoContainer")});
				this.videoView.render();
			}

		});
})