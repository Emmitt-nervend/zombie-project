define([
    'backbone',
    'app/models/map'
], function(
    Backbone,
    Map
) {
    var maps = Backbone.Collection.extend({
        model: Map,
        url: '/rest/maps/by-user/' + USER_ID
    });

    return maps;
});
