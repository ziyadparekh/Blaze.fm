define(['marionette',
	'backbone',
	'app',
	'templates',
	'models/collections',
	'views/error',
	],
	function (Marionette, Backbone, app, templates, Collection, ErrorView){
		return Marionette.ItemView.extend({
			initialize: function(options){
				this.options = options || {};
				this.model = new Collection();
			},
			template: templates.create,
			valid: false,
			events:{
				'click .btn-picture':'toggle_input',
				'click #create-collection': "validate_collection",
				'keyup #collection-name': 'validate_title',
				'click #cancel-create': 'reroute'
			},
			onRender: function(){
				
			},
			reroute: function(e){
				app.router.navigate($(e.currentTarget).attr("data-href"), {trigger: true});
			},
			toggle_input: function(e){
				$("#collection-image").toggleClass("hidden");
				if($("#collection-image").hasClass('hidden'))
					$("#collection-image").prop('disabled', true)
				else
					$("#collection-image").prop('disabled', false)
			},
			validate_collection: function(e){
				var imgRegex = /^https?:\/\/(?:[a-z\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpe?g|gif|png)$/;
				//$(e.currentTarget).prop("disabled", true);
				if($("#collection-name").val().length == 0){
					app.errorRegion.show(new ErrorView({error: "Enter a collection name"}));
					return;
				}else if($("#collection-name").val().length < 4){
					app.errorRegion.show(new ErrorView({error: "Collection name is too short"}));
					return;
				}else if(!this.valid){
					app.errorRegion.show(new ErrorView({error: "This collection already exists"}));
					return;
				}
				else if($("#collection-description").val().length < 10){
					app.errorRegion.show(new ErrorView({error: "Enter a description for your collection"}));
					return;
				}else if($("#collection-image").val().length == 0){
					app.errorRegion.show(new ErrorView({error: "Enter an image for your collection"}));
					return;
				}else if(!$("#collection-image").val().match(imgRegex)){
					app.errorRegion.show(new ErrorView({error: "Enter a valid image url"}));
					return;
				}
				this.create_collection();
			},
			create_collection: function(e){
				var that = this;
				this.model.set({
					name: app.strip($("#collection-name").val()),
					description: app.strip($("#collection-description").val()),
					curator: app.me.get("id"),
					image: $("#collection-image").val(),
					url: app.strip($("#collection-name").val().split(" ").join("-").toLowerCase()) 
				})
				console.log(this.model);
				this.model.sync('create', this.model).done(function(result){
					app.router.navigate("rte/collection/"+result.response.id, {trigger: true})
				});
			},
			validate_title: function(e){
				var that = this;
				var val = $(e.currentTarget).val();
				$.get(endpoint+'collection/available?title='+val, function(result){
					that.valid = result.response;
				})
			}


		});

});