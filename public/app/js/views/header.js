define(['app',
	'marionette',
	'templates',
	'views/video',
	'views/songs'], function (App, Marionette, templates, Video, Songs) {
		"use strict";

		return Backbone.Marionette.ItemView.extend({
			initialize: function(){
				SC.initialize({
					client_id: "d6c27f84e482807bac1fd53be96c3b44"
				});
				this.i = 0;
				this.j = 0;
				this.iterator = 0;
			},
			template: templates.header,
			events: {
				'click #search' : 'remove_placeholder',
				'keyup #search' : 'get_query',
			},
			remove_placeholder: function(){
				$("#search").attr("placeholder","");
			},
			get_query: function(e){
				var q = $("#search").val();
				this.i = 0;
				this.iterator = 0;
				if(e.which == 13){
					var query = q.split(" ");
					switch(query[0]){
						case 'artist':
						var artistQ = "";
						for (var i = 1; i < query.length; i++) {
							artistQ = artistQ+query[i]+" ";
						};
						this.playArtist(artistQ);
						break;
						case 'song':
						var songQ = "";
						for (var i = 1; i < query.length; i++) {
							songQ = songQ+query[i]+" ";
						};
						this.playSong(songQ);
						break;
						case 'video':
						var videoQ = "";
						for (var i = 1; i < query.length; i++) {
							videoQ = videoQ+query[i]+" ";
						};
						this.playVideo(videoQ);

					}
				}
			},
			playArtist: function(artist){
				var that = this;
				var lastFm = "&api_key=64ec63686771e54891e780d68621c780";
				var url = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=";
				this.songsQueue = new Array();
				$.get(url+artist+lastFm+"&format=json", function(toptracks){
					$.each(toptracks, function(i, item){
						//console.log(item.track);
						that.songsQueue.push(item.track);
					})
					that.setupSongs(that.songsQueue);
				})
			},
			
			
			
			
			
			vote_track: function(){
				var that = this;
				var query = this.lookup;
				var id = this.currentId;
				$.ajax({
					type:'POST',
					url:'/tracks',
					data:{
						'query':query,
						'id':id
					},
					success: function(result){
						console.log(result);
					}
				})
			},
			
			
			
			
			executeVideo: function(query){
				if(this.currentTrack){
					this.currentTrack.stop();
					this.$el.find(".fa-pause").addClass("fa-play").removeClass("fa-pause");
				}
				var video = Backbone.Model.extend();
				var model = new video({query: query});
				this.videoView = new Video({model: model, el: $("#center")});
				this.videoView.render();

			},
		})

})