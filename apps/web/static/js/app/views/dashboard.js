define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'text!app/templates/dashboard.handlebars',
    'app/models/zombieUser',
    'app/collections/zombieUsers',
    'app/models/map',
    'app/collections/maps',
    'jqueryui',
    'app/customSetup',
    'twitter-bootstrap'
], function(
    $,
    _,
    Backbone,
    Handlebars,
    template,
    ZombieUser,
    ZombieUsers,
    Map,
    Maps
) {
    var DashboardView = Backbone.View.extend({

        template: Handlebars.compile(template),

        initialize: function() {
            this.constructor.__super__.initialize.apply(this, [this.options]);
            this.zombieUsers = new ZombieUsers();
            this.zombieUsers.on('reset', this.render, this);
            this.zombieUsers.fetch();
            this.maps = new Maps();
            this.maps.on('reset', this.render, this);
            this.maps.fetch();
        },

        destroy: function() {
            this.off();
            this.zombieUsers.off();
            this.maps.off();
        },

        render: function() {
            var current_user = this.zombieUsers.get(USER_ID);
            if(!_.isUndefined(current_user)) {
                current_user = current_user.toJSON();
            }
            this.$el.empty().html(this.template({
                userinfo: current_user,
                user: USER,
                maps: this.maps
            }));
            return this;
        },

        events: {
            'click #submit': 'gamesWon'
        },

        gamesWon: function(e) {
            e.preventDefault();
            var data = $('#gamesWon').val();
            var current_user = this.zombieUsers.get(USER_ID);
            current_user.save({games_won: data});
        }

    });

    return DashboardView;
});
