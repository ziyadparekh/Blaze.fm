require.config({
	paths : {
		requireLib : '../../bower_components/requirejs/require',
		underscore : '../../bower_components/underscore/underscore',
		jquery     : '../../bower_components/jquery/dist/jquery.min',
		backbone   : '../../bower_components/backbone/backbone',
		marionette : '../../bower_components/marionette/lib/backbone.marionette',
		'backbone.wreqr' : '../../bower_components/backbone.wreqr/lib/backbone.wreqr.min',
		'backbone.babysitter' : '../../bower_components/backbone.babysitter/lib/backbone.babysitter.min',
		bootstrap  : '../../bower_components/bootstrap/dist/js/bootstrap.min',
		moment     : '../../bower_components/moment/min/moment.min',
		localstorage: "../../bower_components/backbone.localstorage/backbone.localStorage-min",
		text       : 'lib/text',
		swfobject  : 'lib/swfobject/swfobject',
		soundmanager2 : 'lib/soundmanager/script/soundmanager2'
	},
	shim : {
		"bootstrap": ["jquery"],
		'localstorage' : ['backbone'],
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
		'backbone.wreqr' : {
			deps : ['backbone']
		},
		soundmanager2: {
			exports: 'soundManager'
		},
		swfobject:{
			exports: 'swfobject'
		}
	},
	deps : ['jquery','underscore','requireLib']
});

require(['app',
	'backbone',
	'backbone.wreqr',
	'router/index',
	'controller/index',
	'models/currentSong',
	'models/defaultSong',
	'collections/queue',
	'views/header',
	'views/left',
	'views/queue',
	'bootstrap'
	],function(app,Backbone,Wreqr,Router,Controller, Current, Default, QueueCollection, Header, Left, Queue){
		"use strict";

		$('body').on('click', 'a', function(e){
			var cur = $(e.currentTarget);
			var href = cur.attr('href');
			if(href && href == "#")
				return e.preventDefault();
			if(href && !cur.hasClass('external') && !cur.hasClass('dropdown-toggle')){
				e.preventDefault();
				app.router.navigate(cur.attr('href'), {trigger: true});
				$("html, body").delay(200).animate({ scrollTop: 0 }, 300);
			}
		});
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
		Marionette.Region.prototype.open = function(view){
			this.$el.hide();
			this.$el.empty().append(view.el);
			this.$el.fadeIn("fast");
		}
		app.start();
		app.vent = new Backbone.Wreqr.EventAggregator();

		app.router = new Router({
			controller : Controller
		});

		//Global Models;
		app.currentSong = new Current();
		app.defaultSong = new Default();
		//Global Collections;
		app.queue_collection = new QueueCollection();

		app.headerView = new Header();
		app.header.show(app.headerView);

		app.leftView = new Left({model: app.currentSong});
		app.left.show(app.leftView);

		app.queueView = new Queue({collection: app.queue_collection});
		app.queue.show(app.queueView)

		Backbone.history.start({pushState: true});

	});