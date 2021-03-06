define([
    'jquery',
    'underscore',
    'backbone',
    'app/views/nav',
    'app/views/dashboard',
    'app/views/editor',
    'app/views/settings',
    'app/views/modal'
], function(
    $,
    _,
    Backbone,
    NavView,
    DashboardView,
    EditorView,
    SettingsView,
    ModalView
) {

    var nav = new NavView();

    return Backbone.Router.extend({

        view: null,

        routes: {
            '': 'dashboardRedirect',
            'dashboard': 'dashboard',
            'map-editor': 'editor',
            'map-editor(/:id)': 'editorMap',
            'settings': 'settings',
            'modal': 'modal'
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

        editorMap: function(id) {
            if(HAS_EDITOR_ACCOUNT === "None") {
                this.navigate('#dashboard', {trigger: true, replace: true});
            } else {
                this.cleanup();
                this.render(new EditorView({id:id}), 'editor');
            }
        },

        settings: function() {
            this.cleanup();
            this.render(new SettingsView(), 'settings');
        },

        modal: function() {
            this.cleanup();
            this.render(new ModalView(), 'modal');
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
