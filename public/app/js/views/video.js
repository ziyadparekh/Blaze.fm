define(['app',
	'marionette',
	'templates',
	'swfobject'], function (App, Marionette, templates, swfobject) {
		"use strict";

		return Backbone.Marionette.ItemView.extend({
			initialize: function(){

			},
			template: templates.video,
			events:{
				'keyup #videoSearch' : 'get_query',
				'click .hide' : 'hide_player',
			},
			get_query: function(e){
				var q = $("#videoSearch").val();
				this.i = 0;
				this.iterator = 0;
				if(e.which == 13)
					this.getResults(q);
			},
			hide_player: function(){
				var that = this;
				if(this.hidden){
					this.hidden = false;
					this.$el.find("#videoContainer").css("visibility",'visible');
					this.$el.find("#videoContainer").animate({'opacity':'1'},400);
					return;
				}
				this.$el.find("#videoContainer").animate({'opacity':'0'},200,null, function(){
					that.$el.find("#videoContainer").css("visibility",'hidden');
				});
				this.hidden = true;
			},
			getResults:function(query){
				var that = this;
				var url = "http://gdata.youtube.com/feeds/api/videos?q=";
				var end = "&v=2&alt=json&format=5";
				$.get(url+query+end, function(result){
					console.log("playing video "+result.feed.entry[0].title.$t);
					that.videoCollection = result.feed.entry;
					that.currentId = result.feed.entry[0].id.$t.split(":")[3];
					that.playYoutube(that.currentId);
				})
			},
			playYoutube: function(videoId){
				var that = this;
				var params = { allowScriptAccess: "always", autoplay:'1', allowfullscreen:"true" };
				var atts = { id: "myytplayer" };
				swfobject.embedSWF("http://www.youtube.com/v/"+videoId+"?enablejsapi=1&playerapiid=ytplayer&version=3","ytplayer", "625", "356", "8", null, null, params, atts);
				var ytplayer = document.getElementById("myytplayer");
				$("#video_container").animate({'opacity': '1'},200);
				if(ytplayer)
					ytplayer.playVideo();
			},
			onytplayerStateChange: function(state){
				console.log("players new state "+ state)
			}


		})

})