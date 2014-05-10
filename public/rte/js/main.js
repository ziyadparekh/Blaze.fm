require.config({
	paths : {
		requireLib : '../../bower_components/requirejs/require',
		underscore : '../../bower_components/underscore/underscore',
		jquery     : '../../bower_components/jquery/dist/jquery.min',
		backbone   : '../../bower_components/backbone/backbone',
		marionette : 'lib/backbone.marionette',
		'backbone.wreqr' : '../../bower_components/backbone.wreqr/lib/backbone.wreqr.min',
		'backbone.babysitter' : '../../bower_components/backbone.babysitter/lib/backbone.babysitter.min',
		bootstrap  : '../../bower_components/bootstrap/dist/js/bootstrap.min',
		moment     : '../../bower_components/moment/min/moment.min',
		localstorage: "../../bower_components/backbone.localstorage/backbone.localStorage-min",
		text       : 'lib/text',
		d3		   : '../../bower_components/d3/d3.min',
		playback   : 'lib/playback'
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
		d3 : {
			exports : 'd3'
		},
		playback:{
			exports : 'Playback'
		}
	},
	deps : ['jquery','underscore','requireLib']
});

require(['app',
	'backbone',
	'backbone.wreqr',
	'router/index',
	'controller/index',
	'models/me',
	'views/header',
	'views/leftnav',
	'bootstrap'
	],function(app,Backbone,Wreqr,Router,Controller, Me, Header, LeftNav){
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
		$("#container-body").on("click", function(e){
			var $body = $("#container-body"),
			$leftnav = $("#leftnav"),
			$maze = $("#profile-maze"),
			$logo = $(".logo");
			if($leftnav.is(":visible")){
				$maze.removeClass('left');
				$body.removeClass('left');
				setTimeout(function(){
					$leftnav.addClass("hidden");
					$body.removeClass('fixed');
					$logo.removeClass('hidden');
				}, 400)
			}
		})
		$("#leftnav").on("click", function(e){
			var $body = $("#container-body"),
			$leftnav = $("#leftnav"),
			$maze = $("#profile-maze"),
			$logo = $(".logo");
			if($leftnav.is(":visible")){
				$maze.removeClass('left');
				$body.removeClass('left');
				setTimeout(function(){
					$leftnav.addClass("hidden");
					$body.removeClass('fixed');
					$logo.removeClass('hidden');
				}, 400)
			}
		})
		
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
		// marked.setOptions({
		//   renderer: new marked.Renderer(),
		//   gfm: true,
		//   tables: true,
		//   breaks: false,
		//   pedantic: false,
		//   sanitize: false, // IMPORTANT, because we do MathJax before markdown,
		//                    //            however we do escaping in 'CreatePreview'.
		//   smartLists: true,
		//   smartypants: false
		// });	
		// //

		app.start();
		app.vent = new Backbone.Wreqr.EventAggregator();

		app.router = new Router({
			controller : Controller
		});

		
		app.vent.on('load_page',function(page) {
			if(page == 'user')
				app.userModel = false;
		});

		app.me = new Me(me);
		app.header.show(new Header());
		app.left.show(new LeftNav({model: app.me}));
		Backbone.history.start({pushState: true});

	});