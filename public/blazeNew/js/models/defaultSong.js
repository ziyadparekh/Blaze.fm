define(['backbone'],

	function(Backbone){

		var song = Backbone.Model.extend({
			defaults: {
				"id":  0,
				"src": "/blazeNew/img/album_artwork.gif",
				"name": "No track selected",
				"source":"soundcloud"
			},
			initialize: function(){

			},
			parse:function(data){

			}
		});

		return song;
	});