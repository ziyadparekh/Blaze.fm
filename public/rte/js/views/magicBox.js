define(['marionette',
	'backbone',
	'app',
	'templates',
	'models/thread'
	],
	function (Marionette, Backbone, app, templates, Thread){
		return Marionette.ItemView.extend({
			initialize: function(options){
				this.options = options || {};
				this.thread = new Thread();
			},
			pause: null,
			start: 0,
			difference: null,
			privacy: 0,
			Playback: {
				record: {},
				init: function(recorderId, playbackId){
					this.recorder = document.getElementById( recorderId );
					this.playback = document.getElementById( playbackId );
				}
			},
			template: templates.magicbox,
			events:{
				'click .placeholder': 'show_composer',
				'click .btn-preview': 'toggle_preview',
				'focusin .editor'	: 'initialize_editor',
				'focusout .editor'  : 'pause_record',
				'keyup .editor'     : 'start_recording',
				'click .privacy-choice' : 'change_privacy',
				'click #post-message': 'post_message'
			},
			onRender: function(){
				var that = this;
				setTimeout(function(){
					that.Playback.init( 'recorder', 'playback' );
					$(".btn-tools").tooltip();
				},100)
			},
			post_message: function(e){
				$(e.currentTarget).prop("disabled", true);
				switch(this.privacy){
					case 0:
					this.thread.url = endpoint+"broadcast";
					break;
					case 1:
					this.thread.url = endpoint+"chat";
					break;
				}
				this.thread.set({
					privacy : this.privacy,
					composer : app.me.get("id"),
					receiver : this.model.get("id"),
					body : JSON.stringify(this.Playback.record),
					upvotes : 0,
					preview: $("#recorder").val().substring(0,10)
				});
				this.thread.sync('create', this.thread).done(function(result){
					$(e.currentTarget).prop('disabled', false);
				});
			},
			change_privacy: function(e){
				console.log("click")
				var id = $(e.currentTarget).attr("id");
				switch(id){
					case "public":
					this.$el.find("#privacy-toggle").html('<i class="fa fa-globe"></i> <span class="caret"></span>');
					this.privacy = 0;
					break;
					case "private":
					this.$el.find("#privacy-toggle").html('<i class="fa fa-lock"></i> <span class="caret"></span>');
					this.privacy = 1;
				}
			},
			show_composer: function(e){
				$(e.currentTarget).addClass('hidden');
				this.$el.find(".composer").removeClass('hidden');
			},
			toggle_preview: function(e){
				if(!this.$el.find(".btn-preview").hasClass('active')){
					this.$el.find(".btn-preview").addClass('active');
					this.$el.find(".editor").addClass('hidden');
					this.$el.find(".preview").removeClass('hidden');
					this.show_preview();
					this.pause_record();
				}else{
					this.$el.find(".btn-preview").removeClass('active');
					this.$el.find(".editor").removeClass('hidden');
					this.$el.find(".preview").addClass('hidden');
				}
			},
			initialize_editor: function(){
				this.$el.find(".btn-pause").removeClass('active');
				this.get_difference();
			},
			pause_record: function(){
				this.pause = Object.keys(this.Playback.record).sort().pop();
				this.$el.find(".btn-pause").addClass('active');
				console.log("pause at", this.pause)
			},
			get_difference: function(){
				var time = (new Date()).getTime();
				this.difference = this.pause ? (time - this.pause) : this.pause;
			},
			start_recording: function(e){
				if(e.keyCode == 8){
					this.pause = $(".editor").val().length == 0 ? (new Date().getTime()) :  Object.keys(this.Playback.record).sort().pop()
					this.backspace = true;
					delete this.Playback.record[ Object.keys(this.Playback.record).sort().pop() ];
					if($(".editor").val().length == 0) this.Playback.record = {};
					return;
				}
				if(this.backspace){
					this.get_difference();
					this.backspace = false;
				}
				if($(".editor").val().length == 0) this.Playback.record = {};
				var time = (new Date()).getTime();
				this.Playback.record[ time - this.difference ] = $(".editor").val();
			},
			show_preview: function(){
				var that = this;
				this.Playback.playback.value = '';
				var mark = null;
				for( var t in  this.Playback.record ) {
					if( mark ) {
						var timeout = t - mark;
					} else {
						var timeout = 0;
						mark = t;
					}
                // We need to create a callback which closes over the value of t
                // because t would have changed by the time this is run
                setTimeout( that.changeValueCallback( that.Playback.record[t] ), timeout );
            }
        },
        changeValueCallback: function( val ) {
        	var that = this;
        	return function() { that.Playback.playback.value = val }
        }

    });

});