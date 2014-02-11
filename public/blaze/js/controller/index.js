/*global define*/

define([
	'app',
	'views/blaze',
	'views/tiles',
	'views/footer',
	'views/queue',
	 ], function (app, Blaze, Tiles, Footer, Queue) {
		"use strict";

		return {
			load_modules: function(){
				this.load_header();
				this.load_tiles();
				this.load_footer();
				this.load_queue();
				$(".contentzone").animate({'opacity':1},200);
			},
			load_header: function() {
				var blaze = Backbone.Model.extend();
				var model = new blaze();
				this.blazeView = new Blaze({model:model, el: $("#header_zone") });
				this.blazeView.render();
			},
			load_tiles: function(){
				var tiles = Backbone.Model.extend();
				var model = new tiles();
				this.tilesView = new Tiles({model: model, el: $("#center_column" )});
				this.tilesView.render();
			},
			load_footer: function(){
				var footer = Backbone.Model.extend();
				var model = new footer();
				this.footerView = new Footer({model: model, el: $("footer" )});
				this.footerView.render();
			},
			load_queue: function(){
				var queue = Backbone.Model.extend();
				var model = new queue();
				this.queueView = new Queue({model: model, el: $("#queue")});
				this.queueView.render();
			}

		};
	});