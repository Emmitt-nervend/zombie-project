define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'text!app/templates/settings.handlebars',
    'app/models/zombieUser',
    'app/collections/zombieUsers',
    'app/models/user',
    'app/collections/users',
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
    User,
    Users
) {
    var SettingsView = Backbone.View.extend({

        template: Handlebars.compile(template),

        initialize: function() {
            this.constructor.__super__.initialize.apply(this, [this.options]);
            this.zombieUser = new ZombieUser({id: USER_ID});
            this.zombieUser.on('change', this.render, this);
            this.zombieUser.fetch();
            this.user = new User({id: USER_ID});
            this.user.on('change', this.render, this);
            this.user.fetch();
        },

        destroy: function() {
            this.off();
            this.zombieUser.off();
            this.user.off();
        },

        render: function() {
            console.log(this.zombieUser.attributes.account_type);
            var current_user = "";
            if(!_.isUndefined(this.zombieUser)) {
                current_user = this.zombieUser.toJSON();
            }
            this.$el.empty().html(this.template({
                user_info: this.user.attributes,
                zombie_user_account: this.zombieUser.attributes.account_type,
                user: USER
            }));
            return this;
        },

        events: {
            'click #apply': 'apply_changes',
            'click #password': 'change_password',
            'click #admin': 'become_admin',
        },


        apply_changes: function(e) {
            e.preventDefault();
            var first = $('#firstName').val();
            var last = $('#lastName').val();
            var user = $('#userName').val();
            var email = $('#email').val();
            var designer = document.getElementById('designer');
            console.log(designer);
            var current_user = this.user;
            current_user.save({
                first_name: first, 
                last_name: last,
                username: user,
                email: email})
            var zombieUser = this.zombieUser;
            if (designer.checked) {
                zombieUser.save({account_type: 1});
            }
            else {
                zombieUser.save({account_type: null})
            }
            console.log(this.zombieUser.attributes);
            alert("Changes confirmed");
        },

        change_password: function(e) {
            alert("change password");
        },

        become_admin: function(e) {
            alert("become admin");
        }

    });

    return SettingsView;
});


