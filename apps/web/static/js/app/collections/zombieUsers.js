define([
    'backbone',
    'app/models/zombieUser'
], function(
    Backbone,
    ZombieUser
) {
    var zombieUsers = Backbone.Collection.extend({
        model: ZombieUser,
        url: '/rest/zombie-users'
    });

    return zombieUsers;
});
