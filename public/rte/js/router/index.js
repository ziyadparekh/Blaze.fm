define(['marionette'],function(marionette) {
	'use strict';

	return marionette.AppRouter.extend({

		appRoutes:{
			'/'					: 'load_main',
			'*actions'			: 'load_main',

			
		}

	});

});