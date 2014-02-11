define(['app',
	'marionette',
	'templates',
	'views/leftmenu',
	'soundmanager2'], function (App, Marionette, templates, leftMenu, soundManager) {
		"use strict";

		return Backbone.Marionette.ItemView.extend({
			initialize: function(){
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
				this.iterator = 0;
				this.listenTo(Backbone, 'Next', this.setupSongs);
				this.listenTo(Backbone, 'Previous', this.previous_track);
				this.listenTo(Backbone, 'Version', this.playSong);
				this.listenTo(Backbone, 'ChangeSong', this.playSong);
				this.listenTo(Backbone, 'ArtistSong', this.lookup_soundcloud);
			},
			template: templates.header,
			autocompleteTemplate: _.template(templates.autocomplete),
			events:{
				'keyup #searchBar':'filterOnEnter',
				'click #searchBar': 'clear',
				'click .trackname': 'loadSong',
				'click .leftmenu' : 'openLeftMenu'		
			},
			onRender: function(){
				var that = this;
				$("#audio-test").bind('ended', function(){
					that.check_next();
				});
			},
			openLeftMenu: function(e){
				if(this.leftmenu){
					if(this.leftid === $(e.currentTarget).attr('id')){
						$("#leftmenu").hide();
						this.leftmenu = false;
						return;
					}else{
						$("#leftmenu").hide();
						this.leftmenu = false;
						this.leftid = $(e.currentTarget).attr('id');
					}
				}
				var top = $(e.currentTarget).offset().top;
				var left = $(e.currentTarget).offset().left
				var id = $(e.currentTarget).attr('data-id');
				var src = $(e.currentTarget).attr('data-src');
				var name = $(e.currentTarget).attr('data-name');
				var source = $(e.currentTarget).attr('data-source');
				this.leftid = $(e.currentTarget).attr('id');
				this.leftmenu = true;
				if(this.leftMenu)
					this.leftMenu.close();
				this.leftmenu = new leftMenu({el: $("#leftmenuContainer"), top: top-10, left: left+45, id: id, src: src, name: name, source: source});
				this.leftmenu.render();
				$("#leftmenu").show();
			},
			clear: function(){
				$("#searchBar").val("");
				$("#autobox").slideUp().hide();
				$("#leftmenu").hide();
			},
			filterOnEnter: function(e){
				if($("#searchBar").val().length == 0) $("#autobox").hide();
				this.masterArray = {};
				if(e.which == 13) alert();
				else this.autocomplete();
			},
			autocomplete: function(){
				var that = this;
				var query = $("#searchBar").val();
				var lastFm = "&api_key=64ec63686771e54891e780d68621c780";
				var artistUrl = "http://ws.audioscrobbler.com/2.0/?method=artist.search&limit=4&artist=";
				SC.get('/tracks', { q: query, limit: 6 }, function(tracks) {
					that.songArray = new Array();
					_.each(tracks, function(item, i){
						var tmp = {};
						tmp.image = item.artwork_url==null ? "blaze/img/album_artwork.gif" : item.artwork_url;
						tmp.id = item.id;
						tmp.title = item.title;
						that.songArray.push(tmp);
					})
					that.masterArray.tracks = that.songArray;
				});
				$.get(artistUrl+query+lastFm+"&format=json", function(results){
					that.artistArray = new Array();
					_.each(results, function(item, i){
						that.artistArray.push(item.artistmatches);
					})
					that.masterArray.artist = that.artistArray[0].artist;
					that.renderAutocomplete();
				})
			},
			renderAutocomplete: function(){
				console.log(this.masterArray);
				_.each(this.masterArray.artist, function(item, i){
					var string = JSON.stringify(item.image[2]);
					string = string.split('"')[3];
					item.pic = string
				})
				$("#autobox").html("");
				$("#autobox").append(this.autocompleteTemplate({data:this.masterArray}));
				if(!($("#autobox").is(":visible"))){ 
					$("#autobox").slideDown();
				}
			},
			loadSong: function(e){
				$("#autobox").slideUp().hide();
				$("#leftmenu").hide();
				if($(e.currentTarget).hasClass("artists")){
					artist.name = $(e.currentTarget).text();
					artist.src = $(e.currentTarget).siblings(".trackpic").attr("src");
					this.iterator = 0;
					var that = this;
					var lastFm = "&api_key=64ec63686771e54891e780d68621c780";
					var url = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=";
					songsQueue = [];
					$.get(url+artist.name+lastFm+"&format=json", function(toptracks){
						if(typeof(toptracks) == 'undefined')
							alert("not found");
						else{
							$.each(toptracks, function(i, item){
								songsQueue.push(item.track);
							})
							//that.setupSongs(songsQueue);
							//Backbone.trigger('Artist');
						}
					}).done(function(){ Backbone.trigger('Artist'); })
				}else{
					var id = $(e.currentTarget).attr("id");
					var src = $(e.currentTarget).siblings(".trackpic").attr("src");
					var trackname = $(e.currentTarget).text();
					versions = [];
					song = {};
					song.id = id;
					song.src = src;
					song.trackName = trackname;
					//masterQueue.unshift({'id':id, 'src': src, 'trackName':trackname});
					//console.log(masterQueue);
					//Backbone.trigger('NewItem');
					this.playSong();
				}
			},
			setupSongs: function(tracks){
				console.log(masterQueue);
				if(masterQueue.length < 1){
					return false;
				}else{
					var that = this;
					if(song.trackName){
						$("#audio-test").stop();
					}
					var nextObject = masterQueue.shift();
					song = {};
					song.id = nextObject.id;
					song.trackName = nextObject.trackName;
					song.src = nextObject.src;	
					this.playSong();
					Backbone.trigger("queueShift");
				}
			},
			lookup_soundcloud: function(){
				var that = this;
				var j = 0;
				versions = [];
				SC.get("http://api.soundcloud.com/search/sounds", {limit: 20, offset: 0, q: query}, function(tracks){
					if(tracks.collection.length == 0)
						alert();
					else{
						$.each(tracks.collection, function(i, item){
							if(item.streamable != false){
								var tmp = {};
								tmp.id = item.id;
								tmp.title = item.title;
								tmp.image = item.artwork_url;
								versions.push(tmp);
								i = i+1;
							}
						})
						if(tracks.collection[j]){
							console.log("playing "+tracks.collection[j].title);
							that.currentId = tracks.collection[j].id;
							song = {};
							song.trackName = tracks.collection[j].title
							song.id = that.currentId;
							song.src = tracks.collection[j].artwork_url;
							that.playSong();
						}
					}
				});
			},
			playSong: function(){
				console.log(song);
				Backbone.trigger('Song');	
				SC.get("/tracks/"+song.id, {}, function(sound){
					$("#audio-test").attr("src", sound.stream_url+"?client_id=d6c27f84e482807bac1fd53be96c3b44");
				});
				$("#trackInfo").text("Playing "+song.trackName);
			},
			check_next: function(){
				if(masterQueue.length > 0) {
					this.setupSongs(masterQueue);
				}
			}
		})
})