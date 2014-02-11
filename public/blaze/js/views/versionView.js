define(['app',
	'marionette',
	'templates',
	'views/leftmenu',
	'soundmanager2'], function (App, Marionette, templates, leftMenu, soundManager) {
		"use strict";

		return Backbone.View.extend({
			initialize: function(){
				switch(this.options.type){
					case "versions":
					$("#popup").show().html("").append(this.songVersions({data: this.options.data}));
					break;
					case "topSongs":
					$("#popup").show().html("").append(this.topSongs({data: this.options.data}));
					break;
					default:
					break;
				}
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
			songVersions: _.template(templates.songVersions),
			topSongs: _.template(templates.topSongs),
			events:{
				'click .remix' : 'change_version',
				'click .topsong' : 'change_song',
				'click .fa-chevron-circle-right': 'openLeftMenu'
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
				var artist = $(e.currentTarget).attr('data-artist');
				var source = $(e.currentTarget).attr('data-source');
				this.leftid = $(e.currentTarget).attr('id');
				this.leftmenu = true;
				this.leftmenu = new leftMenu({el: $("#leftmenuContainer"), top: top-10, left: left+45, id: id, src: src, name: name, source: source, artist: artist});
				this.leftmenu.render();
				$("#leftmenu").show();
			},
			change_version: function(e){
				var id = $(e.currentTarget).children("a").attr("id");
				var title = $(e.currentTarget).children("a").text();
				var image = $(e.currentTarget).siblings("img").attr("src");
				song.trackName = title;
				song.id = id;
				song.src = image;
				Backbone.trigger("Version");
			},
			change_song: function(e){
				var title = $(e.currentTarget).children("a").text()+" "+artist.name;
				this.lookupSoundCloud(title, 0);
			},
			lookupSoundCloud: function(query, i){
				var that = this;
				versions = new Array();
				SC.get("http://api.soundcloud.com/search/sounds", {limit: 20, offset: 0, q: query}, function(tracks){
					if(tracks.collection.length == 0)
						alert();
					else{
						$.each(tracks.collection, function(i, item){
							if(item.streamable){
								var tmp = {};
								tmp.id = item.id;
								tmp.title = item.title;
								tmp.image = item.artwork_url;
								versions.push(tmp);
								i = i+1;
							}
						})
						if(tracks.collection[i]){
							console.log("playing "+tracks.collection[i].title);
							that.currentId = tracks.collection[i].id;
							song.trackName = tracks.collection[i].title
							song.id = that.currentId;
							song.src = tracks.collection[i].artwork_url;
							Backbone.trigger("ChangeSong");
						}
					}
				});
			}
		})
	})