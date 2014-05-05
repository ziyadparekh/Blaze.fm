define(['backbone','app', 'moment'],

	function(Backbone, app, moment){

		return Backbone.Model.extend({
			initialize: function(options){
				var that = this;
				this.options = options || {};
			},
			url: function(){
				return endpoint+"post/"+this.options.pid
			},
			parse:function(data){
				data = data.response;
				if(data.user.id == app.me.get("id"))
					data.button = "<button data-id='"+data.id+"' id='delete-post' class='btn'>Delete</button>";
				else
					data.button = "";
				data.datePosted = moment(data.date).format("MMM Do YYYY");
				console.log(data.datePosted);
				return data;
			}
		});
	});