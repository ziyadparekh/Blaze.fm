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
			template: templates.errorBox,
			events:{
				'click .error-close': 'removeError',
				'click .close-error': 'removeError'
			},
			onRender: function(){
				var that = this;
				setTimeout(function(){
					$(".error-message").text(that.options.error)
				},10)
				console.log(this.options.error);
			},
			removeError: function(){
				app.errorRegion.close();
				$("#error").hide();
			}

		});

	});