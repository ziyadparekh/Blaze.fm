
define(function(require){

	"use strict";
	return {
		header        : require('text!templates/header.html'),
		navigation    : require('text!templates/navigation.html'),
		left          : require('text!templates/left.html'),
		autocomplete  : require('text!templates/autocomplete.html'),
		leftmenu      : require('text!templates/leftmenu.html'),
		queue		  : require('text!templates/queue.html'),
		queueItem     : require('text!templates/queueItem.html'),
		likes     	  : require('text!templates/likes.html'),
		likeItem      : require('text!templates/likeItem.html'),
		empty     	  : require('text!templates/empty.html'),
	};
});

