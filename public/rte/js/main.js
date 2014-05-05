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
		preview	   : 'lib/preview',
		medium : 'lib/medium-editor',
	},
	shim : {
		"bootstrap": ["jquery"],
		localstorage : ['backbone'],
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
		medium: {
			exports: "MediumEditor"
		},
		// marked:{
		// 	exports:'marked',
		// },
		preview:{
			exports: 'Preview'
		}
		// pagedownBootstrap:{
		// 	exports : 'pagedownBootstrap',
		// 	deps : ['jquery', 'bootstrap']
		// }
	},
	deps : ['jquery','underscore','requireLib']
});

require(['app',
	'backbone',
	'backbone.wreqr',
	'router/index',
	'controller/index',
	'models/me',
	'bootstrap'
	],function(app,Backbone,Wreqr,Router,Controller, Me){
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

		//initialize marked
		marked.setOptions({
		  renderer: new marked.Renderer(),
		  gfm: true,
		  tables: true,
		  breaks: false,
		  pedantic: false,
		  sanitize: false, // IMPORTANT, because we do MathJax before markdown,
		                   //            however we do escaping in 'CreatePreview'.
		  smartLists: true,
		  smartypants: false
		});	
		//

		app.start();
		app.vent = new Backbone.Wreqr.EventAggregator();

		app.router = new Router({
			controller : Controller
		});

		
		app.vent.on('load_page',function(page) {
		});

		app.me = new Me(user);
		
		Backbone.history.start({pushState: true});

	});