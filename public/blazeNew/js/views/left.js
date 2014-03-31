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
				'mouseover .nav-stacked>li>a':'hover_effect',
				'mouseout .nav-stacked>li>a':'hover_effect_reverse'
			},
			onRender:function(){
				console.log(this.model)
				var that = this;
				SC.get("/tracks/"+that.model.get("id"), {}, function(sound){
					$("#audio-test").attr("src", sound.stream_url+"?client_id=d6c27f84e482807bac1fd53be96c3b44");
				});
			},
			hover_effect: function(e){
				$(e.currentTarget).stop().animate({
					'background-position-x': '0px',
					'background-position-y': '0px'
				}, 150);
			},
			hover_effect_reverse: function(e){
				$(e.currentTarget).stop().animate({
					'background-position-x': '-210px',
					'background-position-y': '-110px'
				}, 150, 'swing');
			},
			onChange:function(){
			}

		});

	});