define([
    'jquery',
    'underscore',
    'backbone',
    'app/views/dashboard',
    'app/views/editor'
], function(
    $,
    _,
    Backbone,
    DashboardView,
    EditorView
) {

    return Backbone.Router.extend({

        view: null,

        routes: {
            '': 'dashboardRedirect',
            'dashboard': 'dashboard',
            'map-editor': 'editor',
            'profile': 'profile'
        },

        dashboardRedirect: function() {
            this.navigate('#dashboard', {trigger: true, replace: true});
        },

        dashboard: function() {
            this.cleanup();
            this.render(new DashboardView(), 'dashboard');
        },

        editor: function() {
            this.cleanup();
            this.render(new EditorView(), 'editor');
        },

        profile: function() {
            this.cleanup();
            this.render(new ProfileView(), 'profile');
        },

        cleanup: function() {
            // Call destroy on old view if defined
            if (this.view && typeof this.view.destroy === 'function') {
                this.view.destroy();
            }
        },

        render: function(view, page) {
            // Save reference to new view
            this.view = view;
            $('#content').empty()
                .append(view.render().el);
        }

    });

});
