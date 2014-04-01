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
				'click .nav-stacked>li>a':'active_page'
			},
			active_page: function(e){
				this.$el.find(".nav-stacked>li>a").removeClass("active");
				$(e.currentTarget).addClass("active")
			},
			active_tab: function(page){
				switch(page){
					case "songs":
					$(".nav-stacked>li:nth-child(1)>a").addClass("active");
					break;
					case "artists":
					$(".nav-stacked>li:nth-child(2)>a").addClass("active");
					break;
					case "favorites":
					$(".nav-stacked>li:nth-child(3)>a").addClass("active");
					break;
					case "history":
					$(".nav-stacked>li:nth-child(4)>a").addClass("active");
					break;
				}
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