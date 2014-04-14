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
				 	var editor = new MediumEditor('.editable');
					 //Preview.Init("marked-mathjax-input", "marked-mathjax-preview" );
					 //Preview.Update();
				}, 100)
			},
			template: templates.editor,
			events:{
				'keyup #marked-mathjax-input':'preview'
			},
			preview: function(e){
				if(e.shiftKey && e.keyCode == 13)
					return
					
				if(e.shiftKey && e.keyCode == 220 ){
					e.preventDefault()
					this.triggerCode()
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
			triggerCode: function(){
				var text = document.getElementById("marked-mathjax-input").innerHTML.replace("|", "<pre contenteditable='true'></pre>")
				document.getElementById("marked-mathjax-input").innerHTML = text;
				console.log(text.innerHTML)
			}
		});

	});
