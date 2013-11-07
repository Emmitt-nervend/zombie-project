define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'text!app/templates/nav.handlebars'
], function(
    $,
    _,
    Backbone,
    Handlebars,
    template
) {
    return Backbone.View.extend({

        template: Handlebars.compile(template),

        el: $('<div id="nav">'),

        setPage: function(page) {
            this.page = page;
        },

        render: function() {
            if (HAS_EDITOR_ACCOUNT == 'None')
                var has_editor = false;
            else
                var has_editor = true;
            this.$el.empty().append(this.template({
                page: this.page,
                user: USER,
                static_prefix: STATIC_PREFIX,
                has_editor_account: has_editor
            }));
            this.delegateEvents();
            return this;
        },

        events: {
            'mouseover .top-right img': 'showPanel',
            'mouseleave .top-right-panel': 'hidePanel'
        },

        showPanel: function() {
            $(".top-right img").addClass("top-right-rotate");
            $(".top-right-panel").show("slide", {direction: "right"});
        },

        hidePanel: function() {
            $(".top-right-panel").hide("slide", {direction: "right"});
            $(".top-right img").removeClass("top-right-rotate");
        }       

    });
});