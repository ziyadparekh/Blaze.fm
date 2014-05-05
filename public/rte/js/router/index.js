define(['marionette'],function(marionette) {
	'use strict';

	return marionette.AppRouter.extend({

		appRoutes:{
			'/'							: 'load_main',
			'#_=_'						: 'load_main',
			'_=_'						: 'load_main',
			'rte/user/:id'				: 'load_user',
			'rte/create'				: 'load_create',
			'rte/collections'			: 'load_collections',
			'rte/collection/:id'		: 'load_collection',
			'rte/edit/collection/:id'	: 'load_edit_collection',
			'rte/post/:id'				: 'load_post',
			'*actions'					: 'load_main',

			
		}

	});

});