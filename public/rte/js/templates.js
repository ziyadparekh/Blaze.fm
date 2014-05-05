
define(function(require){

	"use strict";
	return {
		editor        : require('text!templates/editor.html'),
		profile       : require('text!templates/profile.html'),
		create   	  : require('text!templates/create.html'),
		collection    : require('text!templates/collection.html'),
		collections   : require('text!templates/collections.html'),
		collectionItem: require('text!templates/collectionItem.html'),
		editcollection: require('text!templates/editcollection.html'),
		post		  : require('text!templates/post.html'),
		errorBox   	  : require('text!templates/error.html'),

	};
});

