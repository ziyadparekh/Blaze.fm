define(['app',
	'marionette',
	'templates'], function (App, Marionette, templates) {
		"use strict";

		return Backbone.Marionette.ItemView.extend({
			initialize: function(){
				var pos = {'top': this.options.top+"px", 'left': this.options.left+"px"};
				this.count = 1;
			},
			template: templates.leftMenu,
			onRender: function(){
				$("#leftmenu").css('top',this.options.top+"px");
				$("#leftmenu").css('left',this.options.left+"px");
			},
			events:{
				'click .option' : 'toggleOptions'
			},
			toggleOptions: function(e){
				var that = this;
				$("#leftmenu").hide();
				setTimeout(function(){
					var id = $(e.currentTarget).attr('id');
					if(id == "playNow")
						that.ChangeSong();
					else if(id == 'playNext' && that.count == 1){
						that.count = 2;
						// if(masterQueue.length == 0){
						// 	that.ChangeSong();
						// 	return;
						// }else{
							that.Unshift();
						//}
					}else if(id == 'playLast' && that.count == 1){
						that.count = 2;
						// if(masterQueue.length == 0){
						// 	that.ChangeSong();
						// 	return;
						// }else{
							that.Push();
						//}
					}
				},10);
			},
			ChangeSong: function(){
				if(this.options.source == 'lastfm'){
					query = ""+this.options.name+" "+this.options.artist+"";
					Backbone.trigger("ArtistSong");
				}else if(this.options.source == 'soundcloud'){
					song.id = this.options.id;
					song.src = this.options.src;
					song.trackName = this.options.name;
					Backbone.trigger("ChangeSong");
				}
			},
			Unshift: function(){
				this.count = 1;
				if(this.options.source == 'lastfm'){
					query = ""+this.options.name+" "+this.options.artist+"";
					this.lookupSoundcloud(query);
				}else if(this.options.source == 'soundcloud'){
					var id = this.options.id;
					var src = this.options.src;
					var trackName = this.options.name;
					_.once(masterQueue.unshift({'id': id, 'src': src, 'trackName': trackName}))
					console.log(masterQueue);
					Backbone.trigger('NewItem');	
				}
			},
			Push: function(){
				this.count = 1;
				if(this.options.source == 'lastfm'){
					query = ""+this.options.name+" "+this.options.artist+"";
					this.lookupSoundcloud(query);
				}else if(this.options.source == 'soundcloud'){
					var id = this.options.id;
					var src = this.options.src;
					var trackName = this.options.name;
					_.once(masterQueue.push({'id': id, 'src': src, 'trackName': trackName}))
					console.log(masterQueue);
					Backbone.trigger('NewItem');
				}
			},
			lookupSoundcloud: function(query){
				var that = this;
				var j = 1;
				versions = new Array();
				SC.get("http://api.soundcloud.com/search/sounds", {limit: 20, offset: 0, q: query}, function(tracks){
					if(tracks.collection.length == 0)
						alert("tracks are zero leftmenu.js");
					else{
						$.each(tracks.collection, function(i, item){
							if(item.streamable != false){
								var id = item.id;
								var src = item.artwork_url == null ? "blaze/img/album_artwork.gif" : item.artwork_url;
								var trackName = item.title;
								_.once(masterQueue.unshift({'id': id, 'src': src, 'trackName': trackName}))
								console.log(masterQueue);
								Backbone.trigger('NewItem');
								return false;
							}
						})
						
					}
				})
			}


		})

})