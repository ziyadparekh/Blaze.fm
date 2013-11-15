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
			},
			template: templates.artist,
			events: {
				'keyup #Asearch' : 'get_query',
				'click .refresh': 'refresh_song',
				'click .fa-pause': 'pause_song',
				'click .fa-play': 'play_song',
				'click .fa-forward': 'next_track',
				'click .fa-backward': 'previous_track',
				'click .fa-thumbs-up': 'vote_track',
				'click .Aspecial2' : 'trigger_next'
			},
			get_query: function(e){
				var q = $("#Asearch").val();
				this.i = 0;
				this.iterator = 0;
				if(e.which == 13){
					this.playArtist(q);
					$(".AnextV").html("");
				}
			},
			playArtist: function(artist){
				var that = this;
				var lastFm = "&api_key=64ec63686771e54891e780d68621c780";
				var url = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=";
				this.songsQueue = new Array();
				$.get(url+artist+lastFm+"&format=json", function(toptracks){
					if(typeof(toptracks) == 'undefined')
						that.notFound();
					else{
						$.each(toptracks, function(i, item){
							//console.log(item.track);
							that.songsQueue.push(item.track);
						})
						that.setupSongs(that.songsQueue);
					}
				})
			},
			setupSongs: function(tracks){
				if(typeof(tracks) == 'undefined'){
					this.notFound();
				}
				else{
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
						this.$el.find("#ArtistList").show().animate({'opacity':'1'},200);
						$(".AritstName").text("Looking for "+this.lookup);
						this.lookup_soundcloud(this.lookup, 0);
						this.playing = true;
					}
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
			releventize: function(data){
				if(data.length == 0){
					this.lookup_soundcloud(this.lookup, 0);
					console.log("using old school search");
				}else{
					this.currentId = data[0].sc_id;
					console.log("Releventizing results: playing "+this.lookup);
					$(".AnextV").html("");	
					this.play_soundcloud(this.currentId);
				}
			},
			lookup_soundcloud: function(query, i){
				var that = this;
				this.versions = new Array();
				SC.get("http://api.soundcloud.com/search/sounds", {limit: 20, offset: 0, q: query}, function(tracks){
					if(tracks.collection.length == 0)
						that.notFound();
					else{
						$.each(tracks.collection, function(i, item){
							if(item.stream_url){
								that.versions.push(item.title);
								i = i+1;
							}
						})
						if(tracks.collection[i]){
							console.log("playing "+tracks.collection[i].title);
							that.currentId = tracks.collection[i].id;
							$(".AritstName").text("Playing "+tracks.collection[i].title);
							that.nextVersion();
							that.play_soundcloud(that.currentId);
						}
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
				this.$el.find(".fa-play").addClass("fa-pause").removeClass("fa-play");
				this.$el.find(".ArtistName").text(this.lookup);
				this.nextVersion();
				this.currentTrack.play();
			},
			check_next: function(){
				if (this.songsQueue) {
					this.setupSongs(this.songsQueue);
				}
			},
			next_track:function(){
				this.check_next();
			},
			previous_track:function(){
				if(this.songsQueue){
					if(this.iterator >= 0){
						this.iterator = this.iterator - 2;
						this.setupSongs(this.songsQueue);
					}
				}
			},
			refresh_song: function(){
				this.i += 1
				this.lookup_soundcloud(this.lookup, this.i);
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
			notFound: function(){
				this.$el.find(".ArtistName").text("Not found");
				this.$el.find("#ArtistList").show().animate({'opacity':'1'},200);
			},
			nextVersion: function(){
				if(this.versions){
					if(this.i < this.versions.length-1){
						this.j = this.i + 1;
						$(".AnextV").html("<span class='special'>Next verision: </span><span class='Aspecial2'>"+this.versions[this.j]+"</span>")
					}
				}
			},
			trigger_next: function(){
				this.refresh_song();
			}



		})

})