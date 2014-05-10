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
			template: templates.header,
			events:{
				'click .logo': 'show_leftmenu',
				'click #container-body': 'hide_leftmenu'
			},
			show_leftmenu: function(e){
				$(e.currentTarget).addClass("hidden");
				var $body = $("#container-body"),
				$leftnav = $("#leftnav"),
				$maze = $("#profile-maze");
				$body.addClass('fixed').addClass('left');
				$maze.addClass('left');
				$leftnav.removeClass("hidden");
			},
			hide_leftmenu: function(){

			}

		});

	});