define(['marionette',
	'backbone',
	'app',
	'templates',
	'collections/collections'
	],
	function (Marionette, Backbone, app, templates, Collections){
		return Marionette.ItemView.extend({
			initialize: function(options){
				this.options = options || {};
				this.collection = new Collections();
				this.collection.on("all", this.reload);
				console.log(this.collection)
				this.fetchFollowedCollections();
			},
			template: templates.collections,
			collectionItemTemplate: _.template(templates.collectionItem),
			events: {
				'keyup #collection-search':'load_autocomplete',
				'click .btn-follow': 'toggle_follow'
			},
			fetchFollowedCollections: function(){
				var that = this;
				this.collection.fetch({
					remove: true,
					url: endpoint+'collections/followed',
					success: function(result){
						console.log(result);
						that.renderAuto(result.models)
					}
				})
			},
			load_autocomplete: function(e){
				if($("#collection-search").val().length == 0){
					$(".bucket-label").show();
					this.fetchFollowedCollections();
				}else{
					$(".bucket-label").hide();
				}
				if(e.keyCode == 13) return;
				var that = this;
				var val = $(e.currentTarget).val();
				this.collection.fetch({
					remove: true,
					url: endpoint+'collection/search?title='+val,
					type: 'get',
					success: function(result){
						console.log(result)
						that.renderAuto(result.models)
					}
				})
			},
			renderAuto: function(data){
				console.log(data)
				$("#collection-list").html("");
				$("#collection-list").append(this.collectionItemTemplate({data: data}));
			},
			toggle_follow: function(e){
				if($(e.currentTarget).hasClass("btn")){
					e.preventDefault();
				}
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