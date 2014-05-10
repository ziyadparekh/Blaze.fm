define(['marionette',
	'backbone',
	'app',
	'templates',
	'views/maze',
	'views/user',
	],
	function (Marionette, Backbone, app, templates, Maze, User){
		return Marionette.ItemView.extend({
			initialize: function(options){
				this.options = options || {};
				 $(window).scroll(this.detect_scroll);
			},
			template: templates.profile,
			onRender: function(){
				var that = this;
				setTimeout(function(){
					that.instantiateMaze();
					that.instantiateUser();
				},10)
			},
			instantiateMaze: function(){
				this.maze = new Maze({model: this.model, el: document.getElementById("canvas-container")});
				this.maze.render();
			},
			instantiateUser: function(){
				this.user = new User({model: this.model, el: document.getElementById("user-"+this.model.get("id"))});
				this.user.render();
			},
			detect_scroll: function(){
			}

		});

	});