define(['backbone','app', 'moment'],

	function(Backbone, app, moment){

		return Backbone.Model.extend({
			initialize: function(options){
				this.options = options || {};
			}
		});
	});