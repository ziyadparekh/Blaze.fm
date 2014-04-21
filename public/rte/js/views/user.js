define(['marionette',
	'backbone',
	'app',
	'templates',
	'models/user'
	],
	function (Marionette, Backbone, app, templates, User){
		return Marionette.ItemView.extend({
			initialize: function(options){
				this.options = options || {};
			},
			template: templates.profile,
			onRender: function(){
				console.log(this.model);
			}

		});

	});