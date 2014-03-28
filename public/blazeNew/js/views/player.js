define(['marionette',
	'backbone',
	'app',
	'templates'
	],
	function (Marionette, Backbone, app, templates){
		return Marionette.ItemView.extend({
			initialize: function(options){
				this.options = options || {};
			},
			template: templates.player,
			modelEvents:{
				'change' : 'onChange'
			},
			events:{
				'click .fa-fast-forward': 'check_next',
				'click .fa-heart': 'like',
			},
			onRender:function(){
				var that = this;
				console.log("render")
				console.log(this.model)
				$("#audio-test").bind('ended', function(){
					_.once(that.check_next());
				});
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
						// case "history":
						// app.historyView.check_next();
						// break;
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
				console.log("model change")
				this.render();
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
				$(e.currentTarget).addClass("red");
				app.favorites.add(model, {at:0});
				model.save();
			}

		});

	});