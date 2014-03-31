define(['marionette'],function(marionette) {
	'use strict';

	return marionette.AppRouter.extend({

		appRoutes:{
			'blaze/likes'		: 'load_favorites',
			'blaze/history'		: 'load_history',
			'*actions'			: 'load_modules',

			
		}

	});

});