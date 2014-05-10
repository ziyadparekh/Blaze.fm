define(['marionette',
	'backbone',
	'app',
	'templates',
	'views/messages'
	],
	function (Marionette, Backbone, app, templates, PostView){
		return Marionette.ItemView.extend({
			initialize: function(options){
				this.options = options || {};
			},
			template: templates.userwrapper,
			events:{
				'mouseover .btn-settings':'start_animation',
				'mouseout .btn-settings':'stop_animation'
			},
			onRender: function(){
				var that = this;
				setTimeout(function(){
					that.renderPosts();
				},10)
				console.log(this.model)
			},
			renderPosts: function(){
				var posts = new PostView({el: document.getElementById("content-body"), user: this.model});
				posts.render();
			},
			start_animation: function(){
				this.$el.find(".btn-settings i").addClass("spinning_cog");
			},
			stop_animation: function(){
				this.$el.find(".btn-settings i").removeClass("spinning_cog")
			}

		});

	});