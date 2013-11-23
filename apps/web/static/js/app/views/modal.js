define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'text!app/templates/modalWindow.handlebars',
    'backbone-modal'
], function(
    $,
    _,
    Backbone,
    Handlebars,
    modalTemplate
) {
    
    var ModalView = Backbone.Modal.extend({ 

        template: Handlebars.compile(modalTemplate),
        
        cancelEl: '.bbm-button',

        el: $('<div id="modal">')

    });
    return ModalView;
});