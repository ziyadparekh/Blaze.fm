define(['app',
	'marionette',
	'backbone',
	'app',
	'templates',
	'views/leftmenu',
	'soundmanager2'
	],
	function (app, Marionette, Backbone, app, templates,leftMenu, soundManager){
		return Marionette.ItemView.extend({
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
			},
			template: templates.header,
			autocompleteTemplate: _.template(templates.autocomplete),
			events:{
				'keyup #searchBar':'filterOnEnter',
				'click .leftmenu' : 'openLeftMenu',
				'click #searchBar': 'clear',
			},
			clear: function(){
				$("#searchBar").val("");
				$("#autobox").slideUp().hide();
				$("#leftmenu").hide();
			},
			openLeftMenu: function(e){
				if(app.likesView && app.likesView.leftmenu){
					app.likesView.leftmenu.close();
				}
				if(this.leftmenuopen){
					if(this.leftid === $(e.currentTarget).attr('id')){
						$("#leftmenu").hide();
						this.leftmenuopen = false;
						this.leftmenu.close();
						return;
					}else{
						$("#leftmenu").hide();
						this.leftmenuopen = false;
						this.leftid = $(e.currentTarget).attr('id');
						this.leftmenu.close();
					}
				}
				var top = $(e.currentTarget).offset().top;
				var left = $(e.currentTarget).offset().left
				var id = $(e.currentTarget).attr('data-id');
				var src = $(e.currentTarget).attr('data-src');
				var name = $(e.currentTarget).attr('data-name');
				var source = $(e.currentTarget).attr('data-source');
				var current = $(e.currentTarget).attr('data-current');
				this.leftid = $(e.currentTarget).attr('id');
				this.leftmenuopen = true;
				if(this.leftmenu)
					this.leftmenu.close();
				this.leftmenu = new leftMenu({el: $("#leftmenuContainer"), model: app.currentSong, top: top-10, left: left+45, id: id, src: src, name: name, source: source, current: current});
				this.leftmenu.render();
				$("#leftmenu").show();
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
						if(item.streamable){
							var tmp = {};
							tmp.image = item.artwork_url==null ? "/blazeNew/img/album_artwork.gif" : item.artwork_url;
							tmp.id = item.id;
							tmp.title = item.title;
							that.songArray.push(tmp);
						}
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
					item.pic = item.image[2]["#text"]
				})
				$("#autobox").html("");
				$("#autobox").append(this.autocompleteTemplate({data:this.masterArray}));
				if(!($("#autobox").is(":visible"))){ 
					$("#autobox").slideDown("fast");
				}
			},

		});

});