define(['marionette',
	'backbone',
	'app',
	'templates'
	],
	function (Marionette, Backbone, app, templates){
		return Marionette.ItemView.extend({
			initialize: function(options){
				var that = this;
				this.options = options || {};
				this.model.on("all", this.render);
				// $('body').keypress(function(e){
				// 	if(e.keyCode == 32){
				// 		if(!that.isPlaying("audio-test"))
				// 			$("#audio-test").play()
				// 		else
				// 			$("audio").pause();
				// 	}
				// })

			},
			template: templates.player,
			modelEvents:{
				'change' : 'onChange'
			},
			events:{
				'click .fa-fast-forward': 'check_next',
				'click .fa-star': 'like',
				'keypress #audio-holder': 'pauseSong'
			},
			isPlaying: function (playerId) {
			    var player = document.getElementById(playerId);
			    return !player.paused && !player.ended && 0 < player.currentTime;
			},
			pauseSong: function(e){
				alert(e.keyCode)
				if(e.keyCode == 32)
					alert();
			},
			onRender:function(){
				var that = this;
				console.log("model change");
				console.log("render")
				console.log(this.model)
				$("#audio-test").bind('ended', function(){
					_.once(that.check_next());
				});
				this.addToHistory();
			},
			check_next: function(){
				console.log(app.currentSong)
				if(!(app.queue_collection.length == 0)){
					app.queueView.check_next();
				}else{
					switch(app.currentSong.get("current")){
						// case "song":
						// break;
						// case "artist":
						// app.artistView.check_next();
						// break;
						case "history":
						app.historyView.check_next();
						break;
						case "favorite":
						console.log("reached here");
						app.likesView.check_next();
						break;
						default:
						break;
					}
				}
			},
			onChange:function(){
				
			},
			addToHistory: function(){
				var model = new Backbone.Model();
				model.set({
					'id':app.currentSong.get("id"),
					'src':app.currentSong.get("src"),
					'name':app.currentSong.get("name"),
					'source':app.currentSong.get("source"),
					'liked': app.currentSong.get("liked"),
					'current': 'history'
				})
				if(model.get("id") == 0)
					return;
				app.history.create(model, {at:0});
				model.save();
			},
			like: function(e){
				var model = new Backbone.Model();
				model.set({
					'id':app.currentSong.get("id"),
					'src':app.currentSong.get("src"),
					'name':app.currentSong.get("name"),
					'source':app.currentSong.get("source"),
					'liked': "true",
					'current': 'favorite'
				})
				if(model.get("id") == 0 || $(e.currentTarget).hasClass("active"))
					return;
				$(e.currentTarget).addClass("yellow");
				app.favorites.add(model, {at:0});
				model.save();
			}

		});

	});