define(['marionette',
	'backbone',
	'app',
	'templates',
	'views/Thread',
	'collections/threadlist'
	],
	function (Marionette, Backbone, app, templates, Thread, ThreadList){
		return Backbone.Marionette.CompositeView.extend({
			initialize: function(options){
				this.options = options || {};
				this.user = this.options.user;
				this.collection = new ThreadList();
				this.loadThreads();
			},
			template: templates.wallzone,
			itemView: Thread,
			itemViewContainer:"#wallzone",
			events:{
				'click .show-more':'play_thread',
				'click .btn-play' : 'play_thread',
				'click .btn-delete': 'delete_thread'
			},
			onRender: function(){
				var that = this;
				setTimeout(function(){
					that.$el.find(".btn-sm").tooltip();
					that.$el.find(".img-box").tooltip();
				},100)
			},
			play_thread: function(e){
				var id = $(e.currentTarget).attr("id").split("-")[1],
				model = this.collection.get(id),
				body = model.get("body");
				this.$el.find("#preview-"+id).addClass('hidden');
				this.$el.find("#thread-"+id).removeClass('hidden');
				this.play_message(body, id);
			},
			play_message: function(content, id){
				var that = this;
				this.playback = document.getElementById("thread-"+id);
				var mark = null;
				for( var t in  content ) {
					if( mark ) {
						var timeout = t - mark;
					} else {
						var timeout = 0;
						mark = t;
					}
					setTimeout( that.changeValueCallback( content[t] ), timeout );
				}
			},
			changeValueCallback: function( val ) {
				var that = this;
				return function() { that.playback.innerHTML = val }
			},
			loadThreads: function(){
				var that = this;
				this.collection.fetch({
					url: endpoint+"broadcast/"+that.user.get("id"),
				})
			},
			delete_thread: function(e){
				var that = this;
				var id = $(e.currentTarget).attr("id").split("-")[1];
				$(e.currentTarget).prop('disabled', true);
				$.ajax({
					type:'delete',
					url:endpoint+"thread/"+id,
					complete: function(result){
						that.$el.find("#post-"+id).animate({'height':'0px'}, 200, function(){
							$(this).remove();
						})
					}
				})
			}

		});

});