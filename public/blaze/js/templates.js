
define(function(require){

	"use strict";
	return {
		header		        	: require('text!templates/header.html'),
		tiles		        	: require('text!templates/tiles.html'),
		songTile		        : require('text!templates/songTile.html'),
		songVersions		    : require('text!templates/songVersions.html'),
		artistTile		        : require('text!templates/artistTile.html'),
		topSongs		        : require('text!templates/topSongs.html'),
		autocomplete		    : require('text!templates/autocomplete.html'),
		leftMenu		    	: require('text!templates/leftmenu.html'),
		queue		    		: require('text!templates/queue.html'),
		queueItem		    	: require('text!templates/queueItem.html'),
	};
});

