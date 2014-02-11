define(['app',
	'marionette',
	'templates',
	'soundmanager2'], function (App, Marionette, templates, soundManager) {
		"use strict";

		return Backbone.Marionette.ItemView.extend({
			initialize: function(){
				this.listenTo(Backbone, 'NewItem', this.onRender);
				this.listenTo(Backbone, 'queueShift', this.onRender);
				this.listenTo(Backbone, 'queueShift', this.getVersions);
			},
			template: templates.queue,
			queueTemplate: _.template(templates.queueItem),
			events:{
				'click .fa-times-circle-o': 'removeItem',
				'click .fa-play-circle-o': 'playItem',
			},
			onRender: function(){
				if(!$("#queue").is(":visible") && masterQueue.length > 0){
					$("#queue").show();
				}
				$("#queueList").html("").append(this.queueTemplate({data: masterQueue}));
				setTimeout(function(){
					var container_width = 106 * $("#queueList p").length;
					$("#queueList").css("width", container_width+"px");
				},10);

			},
			playItem: function(e){
				var that = this;
				var id = $(e.currentTarget).parent(".queueItem").attr("id");
				var src = $(e.currentTarget).siblings("img").attr("src");
				var name = $(e.currentTarget).siblings(".itemName").text();
				song = {};
				song.id = id;
				song.src = src;
				song.trackName = name;
				Backbone.trigger("ChangeSong");
				this.getVersions(name);
				this.findAndRemove(masterQueue, id);
				$(e.currentTarget).parent(".queueItem").animate({
					'opacity':0,
					'width':0,
				}, 300, function(){ $(this).parent(".queueItem").remove(); that.onRender(); });
			},
			removeItem: function(e){
				var that = this;
				var id = $(e.currentTarget).parent(".queueItem").attr("id");
				this.findAndRemove(masterQueue, id);
				$(e.currentTarget).parent(".queueItem").animate({
					'opacity':0,
					'width':0,
				}, 300, function(){ $(this).parent(".queueItem").remove(); that.onRender(); });
			},
			findAndRemove: function(array, value){
				_.each(array, function(item, i){
					if(item.id == value){
						array.splice(i, 1)
					}
				});
				console.log(array);
			},
			getVersions: function(query){
				if(typeof query == 'undefined')
					query = song.trackName;
				var that = this;
				query = query.replace("cover", "").replace(/ *\([^)]*\) */g, "");
				console.log(query);
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
					}
				});
				Backbone.trigger("Song");
			}

		})

	})