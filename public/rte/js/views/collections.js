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
			},
			template: templates.collections,
			collectionItemTemplate: _.template(templates.collectionItem),
			events: {
				'keyup #collection-search':'load_autocomplete'
			},
			load_autocomplete: function(e){
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
			reload: function(){

			}


		});

	});