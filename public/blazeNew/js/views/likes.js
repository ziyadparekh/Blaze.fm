define(['app',
	'marionette',
	'backbone',
	'app',
	'templates',
	'views/leftmenu',
	],
	function (app, Marionette, Backbone, app, templates, leftMenu){
		var Item = Backbone.Marionette.ItemView.extend({
			template: templates.likeItem,
			tagName: 'tr',
			className: 'feedactivity',
			events:{
				'click button':'removeItem'
			},
			removeItem:function(e){
				var id = $(e.currentTarget).attr("id");
				this.model.destroy();

			}
		});

		return Marionette.CompositeView.extend({
			initialize: function(options){
				var that = this;
				this.options = options || {};
				this.checkTemplate();
			},
			collectionEvents:{
				'add' : 'onChange',
				'remove': 'onChange'
			},
			events:{
				'click .leftmenu' : 'openLeftMenu'
			},
			onRender:function(){
				console.log(this.collection)
				//this.collection.set(app.defaultSong);
			},
			openLeftMenu: function(e){
				if(this.leftmenuopen){
					if(this.leftid === $(e.currentTarget).attr('id')){
						$("#leftmenu").hide();
						this.leftmenuopen = false;
						this.leftmenu.close();
						return;
					}else{
						$("#leftmenu").hide();
						this.leftmenuopen = false;
						this.leftid = $(e.currentTarget).attr('id');
						this.leftmenu.close();
					}
				}
				var top = $(e.currentTarget).offset().top;
				var left = $(e.currentTarget).offset().left
				var id = $(e.currentTarget).attr('data-id');
				var src = $(e.currentTarget).attr('data-src');
				var name = $(e.currentTarget).attr('data-name');
				var source = $(e.currentTarget).attr('data-source');
				var liked = $(e.currentTarget).attr('data-liked');
				var current = $(e.currentTarget).attr('data-current');
				this.leftid = $(e.currentTarget).attr('id');
				this.leftmenuopen = true;
				if(this.leftmenu)
					this.leftmenu.close();
				this.leftmenu = new leftMenu({el: $("#leftmenuContainer"), model: app.currentSong, top: top-10, left: left+45, id: id, src: src, name: name, source: source, liked:liked, current: current});
				this.leftmenu.render();
				$("#leftmenu").show();
			},
			checkTemplate: function(){
				if (this.collection.length == 0) {
					this.template = templates.empty
				}else{
					this.template = templates.likes
					this.itemView = Item
					this.itemViewContainer = "#favorites"
				}
				//this.render();
			},
			check_next: function(){
				var that = this;
				var index = this.collection.indexOf(this.collection.get(app.currentSong.get("id")));
				console.log(index);
				setTimeout(function(){
					if(index == that.collection.length-1){
						return;
					}else{
						var song = that.collection.at(index+1);
						app.currentSong.set({
							'id':song.get('id'),
							'src':song.get('src'),
							'name':song.get('name'),
							'source':song.get('source'),
							'liked': song.get("liked"),
							'current': song.get("current")
						})
					}
				},500)
			},
			onChange:function(){
				this.checkTemplate();
				console.log(this.collection)
				// var that = this;
				// SC.get("/tracks/"+that.model.get("id"), {}, function(sound){
				// 	$("#audio-test").attr("src", sound.stream_url+"?client_id=d6c27f84e482807bac1fd53be96c3b44");
				// });
				//this.render();
			},
			

		});

});