define([
    'backbone'
], function(
    Backbone
) {
    return Backbone.Model.extend({
    	urlRoot: '/rest/auth/users'
    });
});
