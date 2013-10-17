define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'text!app/templates/settings.handlebars'
], function(
    $,
    _,
    Backbone,
    Handlebars,
    template
) {
    return Backbone.View.extend({

        template: Handlebars.compile(template),

        initialize: function() {
            var self = this;
            this.constructor.__super__.initialize.apply(this, [this.options]);
        },

        destroy: function() {
            this.off();
        },

        events: {
        },

        render: function() {
            this.$el.empty().html(this.template({
            }));
            return this;
        }


    });
    
});
