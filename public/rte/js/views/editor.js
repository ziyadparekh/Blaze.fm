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
						placeholder: "Type your ",
						buttons:['bold', 'italic', 'underline', 'anchor', 'quote', 'image', 'pre', 'unorderedlist']
					});
					var title = new MediumEditor('.title',{
						placeholder: "Title ",
						disableToolbar: true
					});
					var subtitle = new MediumEditor('.subtitle',{
						placeholder: "Abstract",
						disableToolbar: true
					});
				}, 100)
			},
			clone: [],
			template: templates.editor,
			counter: 0,
			events:{
				'keyup #marked-mathjax-input':'preview'
			},
			preview: function(e){
				if(e.shiftKey && e.keyCode == 13)
					return
				if(e.shiftKey && e.keyCode == 52){
					this.counter++;
					if(this.counter % 2 == 0){
						var matched = $("#marked-mathjax-input").html().match(/\$.*?\$/g);
						if(matched != null){
							this.clone = _.union(this.clone, matched)
							this.createLink(this.clone);
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
				var text = match[match.length-1],
				new_text = document.createDocumentFragment(),
				link = document.createElement("a"),
				linkText = document.createTextNode(text);
				link.appendChild(linkText);
				link.id = text;
				link.className = "internal";
				this.pasteHtmlAtCaret(link);
				$("#marked-mathjax-input").html($("#marked-mathjax-input").html().replace(text, " "));
				this.placeCaretAtEnd(document.getElementById("marked-mathjax-input"));
			},
			pasteHtmlAtCaret: function(html){
				var sel, range;
				if (window.getSelection) {
					sel = window.getSelection();
					if (sel.getRangeAt && sel.rangeCount) {
						range = sel.getRangeAt(0);
						range.deleteContents();

						var el = document.createElement("div");
						el.appendChild(html);
						var frag = document.createDocumentFragment(), node, lastNode;
						while ( (node = el.firstChild) ) {
							lastNode = frag.appendChild(node);
						}
						range.insertNode(frag);
					}
				} else if (document.selection && document.selection.type != "Control") {
					document.selection.createRange().pasteHTML(html);
				}
			},
			placeCaretAtEnd: function(el){
				el.focus();
				if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
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
