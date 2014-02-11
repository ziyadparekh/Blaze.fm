define(['app',
	'marionette',
	'templates',
	'soundmanager2'], function (App, Marionette, templates, soundManager) {
		"use strict";

		return Backbone.Marionette.ItemView.extend({
			initialize: function(){
				// this.load_header();
				soundManager.setup({
					url: '../lib/soundmanager/swf',
				  // optional: use 100% HTML5 mode where available
				  preferFlash: false,
				  debugMode: false,
				  useConsole: false,
				  onready: function() {

				  },
				  ontimeout: function() {
				    // Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
				}
			})
				SC.initialize({
					client_id: "d6c27f84e482807bac1fd53be96c3b44"
				});
				this.songsQueue = new Array();
			},
			template: templates.queue,
			events: {
				'keyup #Qsearch' : 'get_query',
				'click .refresh': 'refresh_song',
				'click .fa-pause': 'pause_song',
				'click .fa-play': 'play_song',
				'click .fa-forward': 'next_track',
				'click .fa-backward': 'previous_track',
				'click .fa-thumbs-up': 'vote_track',
				'click .special2' : 'trigger_next'
			},
			get_query: function(e){
				var q = $("#Qsearch").val();
				this.i = 0;
				this.iterator = 0;
				if(e.which == 13){
					this.playSong(q);
					$(".nextV").html("");
				}
			},
			setupSongs: function(tracks){
				var that = this;
				var tracks = tracks[0];
				this.i = 0;
				this.playing = false;
				while(!this.playing && this.iterator < tracks.length){
					this.lookup = tracks[this.iterator].artist.name+" "+tracks[this.iterator].name;
					console.log("playing "+this.lookup);
					if(this.currentTrack){
						this.currentTrack.stop();
						this.$el.find(".fa-pause").addClass("fa-play").removeClass("fa-pause");
					}
					this.iterator++;
					this.lookup_soundcloud(this.lookup, 0);
					this.playing = true;
				}
			},
			lookup_soundcloud: function(query, i){
				var that = this;
				this.versions = new Array();
				SC.get("http://api.soundcloud.com/search/sounds", {limit: 20, offset: 0, q: query}, function(tracks){
					$.each(tracks.collection, function(i, item){
						if(item.stream_url){
							that.versions.push(item.id);
							i = i+1;
						}
					})
					if(tracks.collection[i]){
						console.log("playing "+tracks.collection[i].title);
						that.currentId = tracks.collection[i].id;
						that.nextVersion();
						that.play_soundcloud(that.currentId);
						$(".QueueName").text("Playing "+tracks.collection[i].title);
					}
				});
			},
			play_soundcloud: function(id){
				var that = this;
				if(this.currentTrack)
					this.currentTrack.stop();
				SC.stream("http://api.soundcloud.com/tracks/"+id,{onfinish:function(){that.check_next()}}, function(sound){
					that.currentTrack = sound;
				});
				$(".fa-play").addClass("fa-pause").removeClass("fa-play");
				this.currentTrack.play();
			},
			releventize: function(data){
				if(data.length == 0){
					this.lookup_soundcloud(this.lookup, 0);
					console.log("using old school search");
				}else{
					this.currentId = data[0].sc_id;
					console.log("Releventizing results: playing "+this.lookup);
					this.play_soundcloud(this.currentId);
				}
			},
			lookup_db: function(query){
				var that = this;
				$.ajax({
					type: 'GET',
					url:'/tracks',
					data:{
						'query':query
					},
					success: function(result){
						that.releventize(result);
					}
				})
			},
			playSong: function(song){
				var that = this;
				var lastFm = "&api_key=64ec63686771e54891e780d68621c780";
				var url = "http://ws.audioscrobbler.com/2.0/?method=track.search&track=";
				this.lookup = "";
				this.songArray = new Array();
				$.get(url+song+lastFm+"&format=json", function(results){
					$.each(results, function(i,item){
						that.songArray.push(item.trackmatches);
					})
					//console.log(that.songArray[0].track);
					if(that.songArray[0].track.length==1){
						that.lookup = that.lookup+that.songArray[0].track.artist+" "+that.songArray[0].track.name;
					}else{
						that.lookup = that.lookup+that.songArray[0].track[0].artist+" "+that.songArray[0].track[0].name;
					}
					console.log(that.lookup);
					if(!(that.currentTrack)){
						console.log(that.songsQueue);
						that.lookup_soundcloud(that.lookup,0);
						$("#QueueList").show().animate({'opacity':'1'},200);
						$(".QueueName").text("Looking for "+that.lookup);
					}
					else{
						that.songsQueue.push(that.lookup);
						console.log(that.songsQueue);
					}
				})
				
			},
			check_next: function(){
				if (this.songsQueue) {
					var next_song = this.songsQueue.shift();
					this.lookup_soundcloud(next_song,0);
					this.i = 0;
				}
			},
			next_track:function(){
				this.check_next();
			},
			previous_track:function(){
				if(this.songsQueue){
					if(this.iterator > 1){
						this.iterator = this.iterator - 2;
						this.lookup_soundcloud(this.songsQueue[this.iterator], 0);
					}
					else{
						this.iterator = this.iterator - 1;
						this.lookup_soundcloud(this.songsQueue[this.iterator], 0);
					}
				}
			},
			refresh_song: function(){
				this.i += 1
				this.play_soundcloud(this.versions[this.i]);
				this.currentTrack.stop();
			},
			pause_song: function(e){
				if(this.currentTrack){
					$(e.currentTarget).removeClass("fa-pause");
					$(e.currentTarget).addClass("fa-play");
					this.currentTrack.pause();
				}else{
					return;
				}
			},
			play_song: function(e){
				if(this.currentTrack){
					$(e.currentTarget).removeClass("fa-play");
					$(e.currentTarget).addClass("fa-pause");
					this.currentTrack.play();
				}else{
					return;
				}
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
			nextVersion: function(){
				if(this.versions){
					if(this.i < this.versions.length-1){
						this.j = this.i + 1;
						$(".QnextV").html("<span class='special'>Next verision: </span><span class='special2'>"+this.versions[this.j]+"</span>")
					}
				}
			},
			trigger_next: function(){
				this.refresh_song();
			}

		})

})