define(['app',
	'marionette',
	'templates',
	'models/topic',
	'collections/topics'], function (App, Marionette, templates, Topic, Topics) {
		"use strict";

		return Backbone.Marionette.ItemView.extend({
			initialize: function(){
				this.collection = new Topics(null, {url: '/topics'});
				this.collection.fetch();
			},
			template: templates.topic,
			onRender: function(){
				console.log(this.collection);
			},
			events:{
				'keyup .searchTopic' : 'searchTopic',
				'click .add' : 'addModel'
			},
			searchTopic: function(e){
				var q = $(e.currentTarget).val();
				this.collection = new Topics(null, {url: '/topics?q='+q});
				this.collection.fetch();

				things = this.collection.toJSON();
				// for (var i = Things.length - 1; i >= 0; i--) {
				// 	var templat += _.templates("tmplsulr", thinss[i])
				// };

				$("#sdfsdf").append(templates);

			},
			populate: function(data){
				console.log(data)
			},
			addModel: function(){
				var f = prompt('Enter firstname');
				var topic = new Topic({ firstname: f});
				this.collection.add(topic);
				topic.save();
			}
		})

	})