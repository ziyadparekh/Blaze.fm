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
			template: templates.collection,
			events:{
				'click .btn-follow': 'toggle_follow'
			},
			toggle_follow: function(e){
				var id = $(e.currentTarget).attr("id");
				if($(e.currentTarget).hasClass("follow")){
					$(e.currentTarget).removeClass('follow').addClass("following").text("following");
					$.post(endpoint+"collection/"+id+"/follow", function(result){
						console.log(result)
					})
				}else{
					$(e.currentTarget).removeClass('following').addClass("follow").text("follow");
					$.ajax({
						type: 'delete',
						url: endpoint+'collection/'+id+'/follow',
						complete: function(result){
							console.log(result)
						}
					})
				}
			}

		});

	});