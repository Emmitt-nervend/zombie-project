define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'text!app/templates/dashboard.handlebars',
    'jqueryui'
], function(
    $,
    _,
    Backbone,
    Handlebars,
    template
) {
    var DashboardView = Backbone.View.extend({

        template: Handlebars.compile(template),

        initialize: function() {
            var self = this;
            this.constructor.__super__.initialize.apply(this, [this.options]);
        },

        destroy: function() {
            this.off();
        },


        render: function() {
            console.log(user);
            this.$el.empty().html(this.template({
                user: user,
            }));
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
    return DashboardView;
});
