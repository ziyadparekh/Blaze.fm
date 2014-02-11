define(['app',
	'marionette',
	'templates',
	'soundmanager2',
	'views/songTile',
	'views/versionView'], function (App, Marionette, templates, soundManager, SongTile, Versions) {
		"use strict";

		return Backbone.Marionette.ItemView.extend({
			initialize: function(){
				this.listenTo(Backbone, 'Song', this.loadSongTile);
				this.listenTo(Backbone, 'Song', this.showVersionsTile);
				this.listenTo(Backbone, 'Artist', this.loadArtistTile);
			},
			template: templates.tiles,
			songtile: _.template(templates.songTile),
			artisttile: _.template(templates.artistTile),
			events: {
				'click #songBox': 'showVersions',
				'click #artistBox': 'showSongs'
			},
			onRender:function(){
				this.loadSongTile();
				this.loadArtistTile();
			},
			loadSongTile: function(){
				console.log(versions);
				if(typeof(song.trackName) == 'undefined'){
					song.trackName = "No track selected";
					song.src = "blaze/img/album_artwork.gif";
					
				}else{
					if(song.src == null || song.src == "") song.src = "blaze/img/album_artwork.gif";
				}
				if(versions.length == 0){
					$("#songTile").html("").append(this.songtile({data: song}));
					song.versions = '<div class="songBox"><i class="fa fa-meh-o"></i><br><p class="message">Looks like there are no remixes of this song</p></div>';
				}else{
					song.versions = versions;
					$("#songTile").html("").append(this.songtile({data: song}));
					var songtile = Backbone.Model.extend();
					var model = new songtile();
					this.songTileView = new SongTile({model:model, el: $("#songTile") });
					this.songTileViewInit = true;
					this.songTileView.render();
				}
			},
			showVersions: function(){
				var that = this;
				$("#blackout").show();
				$("#blackout").click(function(){
					$("#blackout").hide();
					$("#popup").hide();
				});
				if(versions.length == 0){
					song.versions = '<div class="songBox"><i class="fa fa-meh-o"></i><br><p class="message">Looks like there are no remixes of this song</p></div>';
				}else{
					song.versions = versions;
				}
				var model = Backbone.Model.extend();
				var versionModel = new model();
				this.versionView = new Versions({model: versionModel, data: song, el: $("#popup"), type:'versions' });
				this.versionView.render();
			},
			loadArtistTile: function(){
				if(typeof(artist.name) == 'undefined'){
					artist.name = "No artist selected";
					artist.src = "blaze/img/defaultArtist.png";
					$("#artistTile").html("").append(this.artisttile({data: artist}))
				}else{
					$("#artistTile").html("").append(this.artisttile({data: artist}))
				}
			},
			showSongs: function(){
				var that = this;
				$("#blackout").show();
				$("#blackout").click(function(){
					$("#blackout").hide();
					$("#popup").hide();
				});
				if(songsQueue.length == 0){
					var data = '<div class="songBox"><i class="fa fa-meh-o"></i><br><p class="message">Looks like this artist has no songs</p></div>';
				}else{
					_.each(songsQueue[0], function(item, i){
						if(item.image){
							var string = JSON.stringify(item.image[2]);
							string = string.split('"')[3];
							item.pic = string
						}
					})
					var data = songsQueue[0];
				}
				console.log(data);
				var model = Backbone.Model.extend();
				var versionModel = new model();
				this.versionView = new Versions({model: versionModel, data: data, el: $("#popup"), type:'topSongs' });
				this.versionView.render();
			},

		})

})