define([
    'backbone',
    'app/models/user'
], function(
    Backbone,
    User
) {
    var users = Backbone.Collection.extend({
        model: User,
        url: '/rest/auth/users'
    });

    return users;
});
