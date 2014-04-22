define([
	'app',
	'views/editor',
	'models/user',
	'models/collection',
	'views/user',
	'views/create',
	'views/collection',
	'views/collections',
	'views/collectionEdit',
	], function (app, Editor, User, CollectionModel, UserView, Create, Collection, Collections, CollectionEdit) {
		"use strict";

		return {
			load_main: function(){
				app.center.show(new Editor())
				console.log("loaded")
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
				app.center.show(new Create())
			},
			load_collection: function(id){
				var model = new CollectionModel({mid: id});
				model.fetch().done(function(){
					console.log(model);
					app.center.show(new Collection({model : model}));
				});
			},
			load_collections: function(){
				app.center.show(new Collections());
			},
			load_edit_collection: function(id){
				var model = new CollectionModel({mid: id});
				model.fetch().done(function(){
					console.log(model);
					app.center.show(new CollectionEdit({model : model}));
				});
			}

		};
	});