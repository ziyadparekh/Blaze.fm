define(['app',
	'marionette',
	'templates'], function (app, Marionette, templates) {
		"use strict";

		var Item = Backbone.Marionette.ItemView.extend({
			template: templates.queueItem,
		})
		return Backbone.Marionette.CompositeView.extend({
			initialize: function(options){
				var that = this;
				this.options = options || {};
				this.collection.on("all", this.render);
				$("#audio-test").bind('ended', function(){
					_.once(that.check_next());
				});
			},
			template: templates.queue,
			itemView: Item,
			itemViewContainer: "#queueList",
			collectionEvents: {
				"add" : "load",
			},
			load:function(){
				console.log(this.collection);
			},
			events:{
				'click .fa-times-circle-o': 'removeItem',
				'click .fa-play-circle-o': 'playItem',
			},
			onRender: function(){
				var that = this;
				if(!$("#queue").is(":visible") && masterQueue.length > 0){
					$("#queue").show();
				}
				setTimeout(function(){
					var container_width = 106 * $("#queueList p").length;
					$("#queueList").css("width", container_width+"px");
				},10);

			},
			check_next:function(){
				var that = this;
				setTimeout(function(){
					if(that.collection.length > 0){
						var song = that.collection.shift();
						app.currentSong.set({
							'id':song.get('id'),
							'src':song.get('src'),
							'name':song.get('name'),
							'source':song.get('source'),
							'liked': song.get("liked")
						})
					}
				},500)
			},
			check_previous: function(){

			}








		})

})