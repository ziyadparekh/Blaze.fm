define(['app',
	'marionette',
	'templates',
	'soundmanager2'], function (App, Marionette, templates, soundManager) {
		"use strict";

		return Backbone.View.extend({
			initialize: function(){

			},
			events:{
				'click .fa-fast-forward': 'check_next',
				'click .fa-fast-backward': 'check_previous',
				'click #queueButton'	: 'showQueue'
			},
			check_next: function(){
				Backbone.trigger('Next');
			},
			check_previous: function(){
				Backbone.trigger('Previous');			
			},
			showQueue: function(){
				if($("#queue").is(":visible")){
					$("#queue").hide();
				}else{
					$("#queue").show();
				}
			}

	})

	});