define(['app',
	'marionette',
	'templates'], function (app, Marionette, templates) {
		"use strict";

		return Backbone.Marionette.ItemView.extend({
			initialize: function(options){
				this.options = options || {};
				console.log(this.options)
				var pos = {'top': this.options.top+"px", 'left': this.options.left+"px"};
			},
			template: templates.leftmenu,
			onRender: function(){
				$("#leftmenu").css('top',this.options.top+"px");
				$("#leftmenu").css('left',this.options.left+"px");
			},
			events:{
				'click .option' : 'toggleOptions'
			},
			toggleOptions:function(e){
				var that = this;
				$("#leftmenu").hide();
				var id = $(e.currentTarget).attr('id');
				if(id == "playNow")
					that.ChangeSong();
				else if(id == 'playNext'){
					that.Unshift();
				}else if(id == 'playLast'){
					that.Push();
				}
			},
			Push: function(){
				if(this.options.source == 'lastfm'){
					query = ""+this.options.name+" "+this.options.artist+"";
					//this.lookupSoundcloud(query);
				}else if(this.options.source == 'soundcloud'){
					var model = new Backbone.Model();
					model.set({
						'id':this.options.id,
						'src':this.options.src,
						'name':this.options.name,
						'source':this.options.source
					})
					app.queue_collection.push(model);
				}
			},
			Unshift: function(){
				if(this.options.source == 'lastfm'){
					query = ""+this.options.name+" "+this.options.artist+"";
					//this.lookupSoundcloud(query);
				}else if(this.options.source == 'soundcloud'){
					var model = new Backbone.Model();
					model.set({
						'id':this.options.id,
						'src':this.options.src,
						'name':this.options.name,
						'source':this.options.source
					})
					app.queue_collection.add(model,{at: 0});
				}
			},
			ChangeSong: function(){
				if(this.options.source == 'lastfm'){
					query = ""+this.options.name+" "+this.options.artist+"";
					//Backbone.trigger("ArtistSong");
				}else if(this.options.source == 'soundcloud'){
					this.model.set({
						'id':this.options.id,
						'src':this.options.src,
						'name':this.options.name,
						'source':this.options.source,
						'liked': this.options.liked
					})
				}
			},
			close: function(){
				this.unbind();
				this.undelegateEvents()
			}
		})

})