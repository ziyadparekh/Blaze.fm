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
	'templates'], function(app,Marionette,Backbone,Wreqr,Router,Controller,templates){
		"use strict";

	$("#center_column").click(function(){
		if($("#leftmenu").is(":visible")){
			$("#leftmenu").hide();
		}
		if($("#autobox").is(":visible")){
			$("#autobox").hide();
		}
	})
	$("#blackout").click(function(){
		if($("#leftmenu").is(":visible")){
			$("#leftmenu").hide();
		}
		if($("#autobox").is(":visible")){
			$("#autobox").hide();
		}
	})
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
	
	//general app
	app.start();
	app.vent = new Backbone.Wreqr.EventAggregator();

	app.router = new Router({
		controller : Controller
	});

	Backbone.history.start({pushState: true});

	window.Controller = Controller;

});