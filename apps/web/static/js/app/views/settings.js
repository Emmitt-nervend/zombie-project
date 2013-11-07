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
    'app/views/settings',
    'jqueryui',
    'app/customSetup',
    'twitter-bootstrap',
    'ink-filepicker'
], function(
    $,
    _,
    Backbone,
    Handlebars,
    template,
    ZombieUser,
    ZombieUsers,
    User,
    Users,
    SettingsView
) {
    return Backbone.View.extend({

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
            var current_user = "";
            if(!_.isUndefined(this.zombieUser)) {
                current_user = this.zombieUser.toJSON();
            }
            this.$el.empty().html(this.template({
                user_info: this.user.attributes,
                zombie_user_account: this.zombieUser.attributes.account_type,
                user: USER,
                profilePic: this.zombieUser.attributes.profile_pic
            }));
            return this;
        },

        events: {
            'click #apply': 'applyChanges',
            'click #password': 'revealPasswordForm',
            'click #admin': 'becomeAdmin',
            'click #changePassword': 'changePassword',
            'click .change-profile': 'filepicker'
        },


        applyChanges: function(e) {
            e.preventDefault();
            var self = this;
            var first = $('#firstName').val();
            var last = $('#lastName').val();
            var user = $('#userName').val();
            var email = $('#email').val();
            var designer = document.getElementById('designer');
            var current_account_state = this.zombieUser.attributes.account_type;
            var current_user = this.user;
            current_user.save({
                first_name: first, 
                last_name: last,
                username: user,
                email: email}, {
                    success: function(response) {
                        alert("Changes confirmed");
                    }
                });
            var zombieUser = this.zombieUser;
            if (designer.checked) {
                zombieUser.save({account_type: 1}, {
                    success: function(response) {
                        console.log(response);
                        if (current_account_state != self.zombieUser.attributes.account_type){   
                            window.location.reload();
                        }
                    }
                });
            }
            else {
                zombieUser.save({account_type: null}, {
                    success: function(response) {
                        console.log(response);
                        if (current_account_state != self.zombieUser.attributes.account_type){   
                            window.location.reload();
                        }
                    }
                });
            }
        },

        revealPasswordForm: function(e) {
            $("#passwordForm").toggleClass('hide');
        },

        changePassword: function(e) {
            var formData = $("#passwordForm").serializeArray();
            var response = $.post( "/rest/change-password", {current_password: formData[0].value,
                                                             new_password: formData[1].value,
                                                             confirm_new_password: formData[2].value},
                function(data) {
                    alert(data);
                    $("#passwordForm").toggleClass('hide');
            })
                .fail(function(response) {
                    alert(response.responseJSON);
                });
        },

        becomeAdmin: function(e) {
            $.get('/rest/admin-request', function (response){
                console.log("MADE IT", response);
            }).fail(function (response){
                console.log("failed");
            });
        },

        filepicker: function(e) {
            var self = this;
            filepicker.pick(function(InkBlob){
                self.zombieUser.save({profile_pic: InkBlob.url}, {
                    success: function(response) {
                        self.$el.empty().html(self.template({
                            user_info: self.user.attributes,
                            zombie_user_account: self.zombieUser.attributes.account_type,
                            user: USER,
                            profilePic: self.zombieUser.attributes.profile_pic
                        }));
                    }
                })
            });
        }

    });

});


