
define(function(require){

	"use strict";
	return {
		editor        : require('text!templates/editor.html'),
		header        : require('text!templates/header.html'),
		leftnav       : require('text!templates/leftnav.html'),
		profile       : require('text!templates/profile.html'),
		userwrapper   : require('text!templates/userwrapper.html'),
		messages   	  : require('text!templates/messages.html'),
		magicbox   	  : require('text!templates/magicbox.html'),
		wallzone   	  : require('text!templates/wallzone.html'),
		thread   	  : require('text!templates/thread.html'),
		emptyview     : require('text!templates/emptyview.html'),
		//old
		create   	  : require('text!templates/create.html'),
		collection    : require('text!templates/collection.html'),
		collections   : require('text!templates/collections.html'),
		collectionItem: require('text!templates/collectionItem.html'),
		editcollection: require('text!templates/editcollection.html'),
		post		  : require('text!templates/post.html'),
		errorBox   	  : require('text!templates/error.html'),

	};
});

