define([
    'jquery',
    'underscore',
    'backbone',
    'app/views/nav',
    'app/views/dashboard',
    'app/views/editor',
    'app/views/settings'
], function(
    $,
    _,
    Backbone,
    NavView,
    DashboardView,
    EditorView,
    SettingsView
) {

    var nav = new NavView();

    return Backbone.Router.extend({

        view: null,

        routes: {
            '': 'dashboardRedirect',
            'dashboard': 'dashboard',
            'map-editor': 'editor',
            'settings': 'settings'
        },

        dashboardRedirect: function() {
            this.navigate('#dashboard', {trigger: true, replace: true});
        },

        dashboard: function() {
            this.cleanup();
            this.render(new DashboardView(), 'dashboard');
        },

        editor: function() {
            if(HAS_EDITOR_ACCOUNT === "None") {
                this.navigate('#dashboard', {trigger: true, replace: true});
            } else {
                this.cleanup();
                this.render(new EditorView(), 'editor');
            }
        },

        settings: function() {
            this.cleanup();
            this.render(new SettingsView(), 'settings');
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
                .append(nav.render().el)
                .append(view.render().el);
        }

    });

});
