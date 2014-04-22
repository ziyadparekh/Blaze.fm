define([
	'backbone',
	'app',
	'models/collectionItem'
	], function (Backbone, app, collection) {
		"use strict";
		return Backbone.Collection.extend({
			model: collection,
			iniitalize: function(options){
				this.options = options || {};
			},
			parse: function(data){
				data = data.response;
				
				return data;
			}
		});

	});