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
				console.log("render")
				console.log(this.model)
			},
			check_next: function(){
				console.log(app.queueView)
				app.queueView.check_next();
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
					'liked': "true"
				})
				if(model.get("id") == 0 || $(e.currentTarget).hasClass("active"))
					return;
				$(e.currentTarget).addClass("red");
				app.favorites.add(model, {at:0});
				model.save();
			}

		});

	});