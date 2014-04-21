define(['backbone'],

	function(Backbone){

		return Backbone.Model.extend({
			initialize: function(options){
				this.options = options || {}
			},
			url: function(){
				return endpoint+"users/"+this.options.id
			},
			parse:function(data){
				data = data.response;
				console.log(data);
				return data;
			}
		});
	});