//node r.js -o build.js
require.config({
	paths : {
		underscore : 'lib/underscore',
		backbone   : 'lib/backbone/backbone',
		bootstrap  : 'lib/bootstrap/bootstrap.min',
		marionette : 'lib/backbone/backbone.marionette',
		jquery     : 'lib/jquery',
		swfobject  : 'lib/swfobject/swfobject',
		wreqr      : 'lib/backbone/backbone.wreqr',
		text       : 'lib/text',
		d3		   : 'lib/d3/d3.v3.min',
		soundmanager2 : 'lib/soundmanager/script/soundmanager2'
	},
	shim : {
		"bootstrap": ["jquery"],
		"highlight": ["jquery"],
		"ui": ["jquery"],
		'lib/backbone/backbone-localStorage' : ['backbone'],
		jquery : {
			exports : '$'
		},
		underscore : {
			exports : '_'
		},
		backbone : {
			exports : 'Backbone',
			deps : ['jquery','underscore','text']
		},
		marionette : {
			exports : 'Backbone.Marionette',
			deps : ['backbone']
		},
		wreqr : {
			deps : ['backbone']
		},
		d3 : {
			exports : 'd3'
		},
		soundmanager2: {
		    exports: 'soundManager'
		},
		swfobject:{
			exports: 'swfobject'
		}
	},
});

var App = {};

require(['app',
	'marionette',
	'backbone',
	'wreqr',
	'routers/index',
	'controller/index',
	'templates',
	'views/leftzone',
	'views/header',
	'views/tips',
	'bootstrap'], function(app,Marionette,Backbone,Wreqr,Router,Controller,templates,LeftZone,Header,Tips){
		"use strict";

	//marionette mods
	Backbone.Marionette.TemplateCache.prototype.loadTemplate = function(templateId) {
		var template = templateId;
		if (!template || template.length === 0){
			var msg = "Could not find template: '" + templateId + "'";
			var err = new Error(msg);
			err.name = "NoTemplateError";
			throw err;
		}
		return template;
	};
	app.WebsiteView = Backbone.View.extend({
		initialize: function(){
			this.load_leftzone();
		},
		events:{
			'click .songs'	: 'load_songs'
		},
		load_leftzone:function(){
			var left = Backbone.Model.extend();
			var model = new left();
			this.leftView = new LeftZone({model:model, el: this.$el.find("#left_column") });
			this.leftView.render();
			$("#left_column").animate({"opacity":1},200);
		},
		


	});

	app.mainview = new app.WebsiteView({ el: $('body') });
	app.mainview.render();





















});