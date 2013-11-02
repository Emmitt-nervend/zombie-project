require.config({
    paths: {
        'underscore': 'vendor/underscore',
        'backbone': 'vendor/backbone',
        'backbone-paginator': 'vendor/backbone.paginator',
        'jquery': 'vendor/jquery-2.0.3',
        'handlebars': 'vendor/handlebars',
        'text': 'vendor/text',
        'twitter-bootstrap': 'vendor/bootstrap.min',
        'jqueryui': 'vendor/jquery-ui-1.10.3.min',
        'lasso': 'vendor/lasso',
        'ink-filepicker': '//api.filepicker.io/v1/filepicker'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'jqueryui': ['jquery'],
        'backbone-paginator': ['backbone'],
        'twitter-bootstrap': ['jquery'],
        'lasso': ['jquery', 'backbone']
    }
});

require([
    'backbone',
    'app/router'
], function(
    Backbone,
    Router
) {
    
    new Router();
    Backbone.history.start();


});
