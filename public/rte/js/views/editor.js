define(['marionette',
	'backbone',
	'app',
	'templates',
	'preview',
	'medium',
	],
	function (Marionette, Backbone, app, templates, Preview, MediumEditor){
		return Marionette.ItemView.extend({
			initialize: function(){
				//this.initializeMarked();
			},
			onRender: function(){
				var that = this;
				setTimeout(function(){
					var editor = new MediumEditor('.editable',{
						placeholder: "Type your "
					});
					var title = new MediumEditor('.title',{
						placeholder: "Title ",
						disableToolbar: true
					});
					var subtitle = new MediumEditor('.subtitle',{
						placeholder: "Abstract",
						disableToolbar: true
					});
					 //Preview.Init("marked-mathjax-input", "marked-mathjax-preview" );
					 //Preview.Update();
					}, 100)
			},
			template: templates.editor,
			counter: 0,
			events:{
				'keyup #marked-mathjax-input':'preview'
			},
			preview: function(e){
				var ctrlDown = e.ctrlKey||e.metaKey;
				console.log(ctrlDown);
				if(e.shiftKey && e.keyCode == 13)
					return
				if(ctrlDown && e.keyCode == 90){
					this.triggerCode()
				}
				if(e.shiftKey && e.keyCode == 52){
					this.counter++;
					console.log(this.counter)
					if(this.counter % 2 == 0){
						console.log($("#marked-mathjax-input").html().match(/\$.*?\$/))
						var matched = $("#marked-mathjax-input").text().match(/\$.*?\$/);
						if(matched != null){
							this.createLink(matched);
						}
					}
				}

				// Preview.Init("marked-mathjax-input", "marked-mathjax-preview-buffer");
				// Preview.Update();
				// if(timeOut) clearTimeout(timeOut)
				// var timeOut = setTimeout(function(){
				// 	var text = document.getElementById('marked-mathjax-input').innerHTML;
				// 	var buffer = document.getElementById('marked-mathjax-preview');
				// 	// Preview.Init("marked-mathjax-", "marked-mathjax-preview" );
				// 	// Preview.Update();
				// }, 2500)

},
createLink: function(match){
	var selection = window.getSelection();
	// range = selection.getRangeAt(0);
	// console.log(range.getBoundingClientRect())
	var text = match[0];
	var new_text = document.createDocumentFragment();
	var link = document.createElement("a");
	var linkText = document.createTextNode(text);
	link.appendChild(linkText);
	link.href = text;
	link.className = "internal";
	//selection.focusNode.nodeValue = selection.focusNode.nodeValue.replace(text, "");
	console.log(selection.anchorNode.parentNode)
	//selection.anchorNode.parentNode.appendChild(link);
	this.pasteHtmlAtCaret(link);
	this.placeCaretAtEnd(document.getElementById("marked-mathjax-input"))
},
pasteHtmlAtCaret: function(html){
	var sel, range;
	if (window.getSelection) {
	       // IE9 and non-IE
	       sel = window.getSelection();
	       if (sel.getRangeAt && sel.rangeCount) {
	       	range = sel.getRangeAt(0);
	       	range.deleteContents();

	           // Range.createContextualFragment() would be useful here but is
	           // only relatively recently standardized and is not supported in
	           // some browsers (IE9, for one)
	           var el = document.createElement("div");
	           el.innerHTML = html;
	           var frag = document.createDocumentFragment(), node, lastNode;
	           while ( (node = el.firstChild) ) {
	           	lastNode = frag.appendChild(node);
	           }
	           range.insertNode(frag);

	           // Preserve the selection
	           if (lastNode) {
	           	range = range.cloneRange();
	           	range.setStartAfter(lastNode);
	           	range.collapse(true);
	           	sel.removeAllRanges();
	           	sel.addRange(range);
	           }
	       }
	   } else if (document.selection && document.selection.type != "Control") {
	       // IE < 9
	       document.selection.createRange().pasteHTML(html);
	   }
	},
	triggerCode: function(){
		$("#marked-mathjax-input").text($("#marked-mathjax-input").text().replace("|",""));
		var pre = document.createElement("pre");
		pre.setAttribute("contentEditable", true);
		var selection = window.getSelection();
		document.getElementById("marked-mathjax-input").appendChild(pre);
		this.placeCaretAtEnd(document.getElementById("marked-mathjax-input"))
	},
	placeCaretAtEnd: function(el){
		el.focus();
		if (typeof window.getSelection != "undefined"
			&& typeof document.createRange != "undefined") {
			var range = document.createRange();
		range.selectNodeContents(el);
		range.collapse(false);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	} else if (typeof document.body.createTextRange != "undefined") {
		var textRange = document.body.createTextRange();
		textRange.moveToElementText(el);
		textRange.collapse(false);
		textRange.select();
	}
}

});

});
