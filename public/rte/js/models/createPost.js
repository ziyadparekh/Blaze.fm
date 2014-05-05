define(['backbone'],

	function(Backbone){

		return Backbone.Model.extend({
			initialize: function(options){
				var that = this;
				this.options = options || {};
			},
			url: function(){
				return endpoint+"post/create"
			},
			parse:function(data){

			}
		});
	});