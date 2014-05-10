define(['marionette',
	'app',
	'templates',
	'views/magicBox',
	'views/wall'
	],
	function (Marionette, app, templates, MagicBox, WallView) {
		return Marionette.ItemView.extend({
			initialize: function(options){
				this.options = options || {};
			},
			template: templates.messages,
			onRender: function(){
				var that = this;
				setTimeout(function(){
					that.loadmagicBox();
					that.renderWall();
				},10)
			},
			loadmagicBox: function(){
				var magicbox = new MagicBox({model: this.options.user, el: document.getElementById("create-message")});
				magicbox.render();
			},
			renderWall: function(){
				var wall = new WallView({el: document.getElementById("feed-container"), user: this.options.user});
				wall.render();
			},
		});
	});