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
			template: templates.left,
			modelEvents:{
				'change' : 'onChange'
			},
			onRender:function(){
				console.log(this.model)
			},
			onChange:function(){
				var that = this;
				SC.get("/tracks/"+that.model.get("id"), {}, function(sound){
					$("#audio-test").attr("src", sound.stream_url+"?client_id=d6c27f84e482807bac1fd53be96c3b44");
				});
				this.render();
			}

		});

	});