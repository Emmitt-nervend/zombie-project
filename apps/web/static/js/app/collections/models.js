define([
    'app/models/model'
], function(
    Model
) {
    return Backbone.Collection.extend({
        model: Model
    });
});
