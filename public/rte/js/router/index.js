define(['marionette'],function(marionette) {
	'use strict';

	return marionette.AppRouter.extend({

		appRoutes:{
			'/'							: 'load_main',
			'#_=_'						: 'load_main',
			'_=_'						: 'load_main',
			'user/:id'					: 'load_user',
			'*actions'					: 'load_main',
		}

	});

});