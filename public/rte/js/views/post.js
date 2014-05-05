define(['marionette',
	'backbone',
	'app',
	'templates',
	'models/post'
	],
	function (Marionette, Backbone, app, templates, Post){
		return Marionette.ItemView.extend({
			initialize: function(options){
				this.options = options || {};
				console.log(this.model)
			},
			template: templates.post,
			events:{
				'click #delete-post':'delete_post'
			},
			delete_post: function(e){
				var id = $(e.currentTarget).attr("data-id");
				$.ajax({
					type:'delete',
					url:endpoint+"post/"+id,
					success: function(result){
						app.router.navigate("/rte/collections", {trigger:true})
					}
				})
			},
			onRender: function(){
				var that = this;
				setTimeout(function(){
					var text = document.getElementById("marked-mathjax-input").innerHTML;
					that.buffer = document.getElementById("marked-mathjax-preview-buffer");
					that.buffer.innerHTML = text;
					that.mjRunning = true;
					MathJax.Hub.Queue(
					  ["Typeset",MathJax.Hub,that.buffer],
					  ["PreviewDone",that]
					);
				}, 100)
			},
			PreviewDone: function(){
				var body = document.getElementById("marked-mathjax-input");
				this.mjRunning = false;
				body.innerHTML = this.buffer.innerHTML;
			}

		});

	});