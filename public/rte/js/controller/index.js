define([
	'app',
	'views/editor',
	'models/user',
	'models/collection',
	'models/post',
	'views/user',
	'views/create',
	'views/post',
	'views/collection',
	'views/collections',
	'views/collectionEdit',
	], function (app, Editor, User, CollectionModel, PostModel, UserView, Create, Post, Collection, Collections, CollectionEdit) {
		"use strict";

		return {
			load_main: function(){
				app.collection.close();
				$("#center-container").removeClass("hidden");
				app.center.show(new Editor());
				$("#collection-container").addClass("hidden");
			},
			load_post: function(id){
				app.collection.close();
				$("#center-container").removeClass("hidden");
				var model = new PostModel({pid: id});
				model.fetch().done(function(){
					console.log(model)
					app.center.show(new Post({model: model}));
					$("#collection-container").addClass("hidden");
				})
			},
			load_user: function(id){
				if(!app.userModel){
					app.userModel = new User({id: id});
					app.userModel.fetch().done(function(){
						app.center.show( new UserView({model: app.userModel}));
						console.log("user");
					})
				}else{
					app.center.show( new UserView({model: app.userModel}));
					console.log("user");
				}
			},
			load_create: function(){
				app.collection.close();
				$("#center-container").removeClass("hidden");
				app.center.show(new Create());
				$("#collection-container").addClass("hidden");
			},
			load_collection: function(id){
				app.collection.close();
				$("#center-container").removeClass("hidden");
				var model = new CollectionModel({mid: id});
				model.fetch().done(function(){
					console.log(model);
					app.center.show(new Collection({model : model}));
					$("#collection-container").addClass("hidden");
				});
			},
			load_collections: function(){
				app.center.close();
				$("#collection-container").removeClass("hidden");
				app.collection.show(new Collections());
				$("#center-container").addClass("hidden");
			},
			load_edit_collection: function(id){
				app.collection.close();
				$("#center-container").removeClass("hidden");
				var model = new CollectionModel({mid: id});
				model.fetch().done(function(){
					console.log(model);
					app.center.show(new CollectionEdit({model : model}));
					$("#collection-container").addClass("hidden");
				});
			}

		};
	});