define(['backbone'],

	function(Backbone){

		return Backbone.Model.extend({
			initialize: function(options){
				var that = this;
				this.options = options || {};
			},
			defaults:{
				'id': 0,
				'name':'default',
				'image': 'http://blogs.scientificamerican.com/degrees-of-freedom/files/2011/09/page3_1.jpg'
			}	
		});
	});