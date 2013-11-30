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
            'click #submit': 'gamesWon',
            'click .delete': 'deleteMap',
            'click #addWin': 'winloss',
            'click #subWin': 'winloss',
            'click #addLoss': 'winloss',
            'click #subLoss': 'winloss'
        },
        gamesWon: function(e) {
            e.preventDefault();
            var data = $('#gamesWon').val();
            var current_user = this.zombieUsers.get(USER_ID);
            current_user.save({games_won: data});
        },

        deleteMap: function(e) {
            e.preventDefault();
            var $target = $(e.target);
            var mapIdToDelete = $target.attr('data-id');
            var self = this;
            this.maps.get(mapIdToDelete).destroy({success: function(model, response) {
                self.render();
            }});
        },

        winloss: function (e) {
            e.preventDefault();
            if(e.target.id == 'addLoss'){
                var lost = this.zombieUser.get('games_lost');
                if (lost)
                    lost += 1;
                else
                    lost = 1;
                this.zombieUser.set({games_lost: lost});
            }
            if(e.target.id == 'subLoss'){
                var lost = this.zombieUser.get('games_lost');
                if(lost > 0)
                    lost -= 1;
                this.zombieUser.set({games_lost: lost});
            }
            if(e.target.id == 'addWin'){
                var win = this.zombieUser.get('games_won');
                if (win)
                    win += 1;
                else
                    win = 1;
                this.zombieUser.set({games_won: win});
            }
            if(e.target.id == 'subWin'){
                var win = this.zombieUser.get('games_won');
                if(win > 0)
                    win -= 1;
                this.zombieUser.set({games_won: win});
            }
            this.zombieUser.save();

        }

    });

    return DashboardView;
});
