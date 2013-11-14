define(['app',
	'marionette',
	'templates'], function (App, Marionette, templates) {
		"use strict";

		return Backbone.Marionette.ItemView.extend({
			initialize: function(){

			},
			template: templates.tips

		})

	})