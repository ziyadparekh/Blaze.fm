define([
	'app',
	'models/user',
	'views/profile'
	], function (app, User, ProfileView) {
		"use strict";

		return {
			load_main: function(){
				this.load_user();
			},
			load_user: function(id){
				app.vent.trigger('load_page', "user")
				if(!app.userModel){
					app.userModel = new User({id: id});
					app.userModel.fetch().done(function(){
						$("#center-container").removeClass("hidden");
						app.center.show( new ProfileView({model: app.userModel}));
					})
				}else{
					$("#center-container").removeClass("hidden");
					app.center.show( new ProfileView({model: app.userModel}));
				}
			}

		};
	});