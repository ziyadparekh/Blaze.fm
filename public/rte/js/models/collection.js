define(['backbone','app'],

	function(Backbone, app){

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
				if(data.user.id == app.me.get("id"))
					data.button = "<a href='/rte/edit/collection/"+data.id+"' id='edit' title='Edit collection' class='btn btn-light'>Edit</a>";
				else
					data.button = "";
				return data;
			}
		});
	});