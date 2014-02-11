define(['marionette'],function(marionette) {
	'use strict';

	return marionette.AppRouter.extend({

		appRoutes:{
			'*actions'					: 'load_modules'
			
		}

	});

});