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
            this.zombieUser = new ZombieUser({id: USER_ID});
            this.zombieUser.on('reset change', this.render, this);
            this.zombieUser.fetch();
            this.maps = new Maps();
            this.maps.on('reset', this.render, this);
            this.maps.fetch();
        },

        destroy: function() {
            this.off();
            this.zombieUser.off();
            this.maps.off();
        },

        render: function() {
            var current_user = "";
            if(!_.isUndefined(this.zombieUser)) {
                current_user = this.zombieUser.toJSON();
            }
            this.$el.empty().html(this.template({
                userinfo: current_user,
                user: USER,
                maps: this.maps.models,
                profile_pic: current_user.profile_pic,
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
