define(['marionette',
	'backbone',
	'app',
	'templates',
	'models/createPost',
	'views/error',
	'preview',
	'medium',
	],
	function (Marionette, Backbone, app, templates, Post,  ErrorView, Preview, MediumEditor){
		return Marionette.ItemView.extend({
			initialize: function(){
				this.model = new Post();
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
				'keyup #marked-mathjax-input':'preview',
				'keyup #post-title':'titlepreview',
				'keyup #post-subtitle':'titlepreview',
				'click #preview-post' : 'showPreview',
				'click #cancel-post': "reroute",
				'click #save-post': "validate_post",
			},
			reroute: function(e){
				app.router.navigate($(e.currentTarget).attr("data-href"), {trigger: true});
			},
			validate_post: function(e){
				if($("#post-title").text().length == 0){
					app.errorRegion.show(new ErrorView({error: "Enter a title for your post"}));
					return;
				}
				else if($("#post-subtitle").text().length < 5){
					app.errorRegion.show(new ErrorView({error: "Enter a description about your post"}));
					return;
				}else if($("#marked-mathjax-input").text().length == 0){
					app.errorRegion.show(new ErrorView({error: "Your post needs a body"}));
					return;
				}
				this.save_post();
			},
			save_post: function(){
				var that = this;
				this.model.set({
					author: app.me.get("id"),
					title: $("#post-title").text(),
					abstract: $("#post-subtitle").text(),
					post: $("#marked-mathjax-input").html().toString()
				})
				this.model.sync('create', this.model).done(function(result){
					app.router.navigate("rte/post/"+result.response.id, {trigger: true})
				})
			},
			showPreview: function(e){
				if(!($(e.currentTarget).hasClass("active"))){
					$(e.currentTarget).addClass("active");
					$(".post-wrap").css("right", '18%');
					$(".post-preview").css('opacity', 1);
				}else{
					$(e.currentTarget).removeClass("active");
					$(".post-wrap").css("right", "0");
					$(".post-preview").css('opacity', 0);
				}
				Preview.Init();
				Preview.Update();
			},
			titlepreview: function(){
				var header = document.getElementById("post-title").innerHTML,
				abstract = document.getElementById("post-subtitle").innerHTML;

				this.titlepreview = document.getElementById("title-preview");
				this.titlepreview.innerHTML = header;

				this.subtitlepreview = document.getElementById("subtitle-preview");
				this.subtitlepreview.innerHTML = abstract;
			},
			preview: function(e){
				if(e.shiftKey && e.keyCode == 13)
					return
				// if(e.shiftKey && e.keyCode == 52){
				// 	this.counter++;
				// 	if(this.counter % 2 == 0){
				// 		var matched = $("#marked-mathjax-input").html().match(/\$.*?\$/g);
				// 		if(matched != null){
				// 			this.clone = _.union(this.clone, matched)
				// 			this.createLink(this.clone);
				// 		}
				// 	}
				// }
				Preview.Init();
				Preview.Update();
				// if(timeOut) clearTimeout(timeOut)
				// var timeOut = setTimeout(function(){
				// 	var text = document.getElementById('marked-mathjax-input').innerHTML;
				// 	var buffer = document.getElementById('marked-mathjax-preview');
				// 	// Preview.Init("marked-mathjax-", "marked-mathjax-preview" );
				// 	// Preview.Update();
				// }, 2500)
			},
			// createLink: function(match){
			// 	var text = match[match.length-1],
			// 	new_text = document.createDocumentFragment(),
			// 	link = document.createElement("a"),
			// 	linkText = document.createTextNode(text);
			// 	link.appendChild(linkText);
			// 	link.id = text;
			// 	link.className = "internal";
			// 	this.pasteHtmlAtCaret(link);
			// 	$("#marked-mathjax-input").html($("#marked-mathjax-input").html().replace(text, " "));
			// 	this.placeCaretAtEnd(document.getElementById("marked-mathjax-input"));
			// },
			// pasteHtmlAtCaret: function(html){
			// 	var sel, range;
			// 	if (window.getSelection) {
			// 		sel = window.getSelection();
			// 		if (sel.getRangeAt && sel.rangeCount) {
			// 			range = sel.getRangeAt(0);
			// 			range.deleteContents();

			// 			var el = document.createElement("div");
			// 			el.appendChild(html);
			// 			var frag = document.createDocumentFragment(), node, lastNode;
			// 			while ( (node = el.firstChild) ) {
			// 				lastNode = frag.appendChild(node);
			// 			}
			// 			range.insertNode(frag);
			// 		}
			// 	} else if (document.selection && document.selection.type != "Control") {
			// 		document.selection.createRange().pasteHTML(html);
			// 	}
			// },
			// placeCaretAtEnd: function(el){
			// 	el.focus();
			// 	if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
			// 		var range = document.createRange();
			// 		range.selectNodeContents(el);
			// 		range.collapse(false);
			// 		var sel = window.getSelection();
			// 		sel.removeAllRanges();
			// 		sel.addRange(range);
			// 	} else if (typeof document.body.createTextRange != "undefined") {
			// 		var textRange = document.body.createTextRange();
			// 		textRange.moveToElementText(el);
			// 		textRange.collapse(false);
			// 		textRange.select();
			// 	}
			// }

		});

});
