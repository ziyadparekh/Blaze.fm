define(['marionette',
	'backbone',
	'app',
	'templates'
	],
	function (Marionette, Backbone, app, templates){
		return Marionette.ItemView.extend({
			initialize: function(options){
				this.options = options || {};
				this.model.on("all", this.render)
			},
			template: templates.left,
			modelEvents:{
				'change' : 'onChange'
			},
			events:{

			},
			onRender:function(){
				console.log(this.model)
				var that = this;
				SC.get("/tracks/"+that.model.get("id"), {}, function(sound){
					$("#audio-test").attr("src", sound.stream_url+"?client_id=d6c27f84e482807bac1fd53be96c3b44");
				});
			},
			onChange:function(){
			}

		});

	});