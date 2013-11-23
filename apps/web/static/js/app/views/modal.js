define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'text!app/templates/modal.handlebars',
    'text!app/templates/modalWindow.handlebars',
    'backbone-modal'
], function(
    $,
    _,
    Backbone,
    Handlebars,
    template,
    modalTemplate
) {
    
    var ModalView = Backbone.View.extend({ 

        template: Handlebars.compile(template),

        render: function() {
            this.$el.empty().append(this.template({            
            }));
            this.delegateEvents();
            return this;
        },

        events: {
            'click button': 'modal'
        },

        modal: function() {

            // Create a modal view class
            var Modal = Backbone.Modal.extend({
                template: Handlebars.compile(modalTemplate),
                cancelEl: '.bbm-button',
                el: $('<div id="modal">')
            });
            
            var modalView = new Modal();

            $("#modal").html(modalView.render({
                maps: ['kevin', 'bryce', 'russ'],
                person: "Bob"
            }).el);
        }

    });
    return ModalView;
});