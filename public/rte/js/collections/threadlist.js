define([
	'backbone',
	'app',
	'models/thread'
	], function (Backbone, app, Thread) {
		"use strict";
		return Backbone.Collection.extend({
			model: Thread,
			iniitalize: function(options){
				this.options = options || {};
			},
			parse: function(data){
				data = data.response;
				for (var i = 0; i < data.length; i++) {
					this.itemParse(data[i]);
				};
				return data;
			},
			itemParse: function(item){
				item.body = this.linkifymessage(item.body);
				item.body = JSON.parse(item.body);
				return item;
			},
			linkifymessage: function(inputText) {
				var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, "<a href='$1' class='external' target='_blank'>$1</a>");

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, "<a href='http://$2' class='external' target='_blank'>$2</a>");

    return " "+replacedText+ " "
}
});

});