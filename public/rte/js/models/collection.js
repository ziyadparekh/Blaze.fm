define(['backbone'],

	function(Backbone){

		return Backbone.Model.extend({
			initialize: function(options){
				var that = this;
				this.options = options || {};
			},
			url: function(){
				return endpoint+"collection/"+this.options.mid
			},
			parse:function(data){
				var data = data.response;
				return data;
			}
		});
	});