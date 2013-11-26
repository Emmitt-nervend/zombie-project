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

        el: $('<div id="modal">'),

        // events:
        // {
        //     'click #submitEvent': 'submitEvent'
        // },
        
        submitEvent: function(){
            var self = this;
            var data = {
                value:"",
                mapId:"",
                d_x:"",
                d_y:""
            };
            if(this.$('#treasure').length>0)
            {
                data.value = self.$("input:checked").val();
                console.log(data.value);
            }
            else if(this.$('#transfer').length>0)
            {
                data.mapId = self.$('#mapList').val();
                data.d_x = self.$('#d_x').val();
                data.d_y = self.$('#d_y').val();
                console.log(data.mapId);
                console.log(data.d_x);
                console.log(data.d_y);
            }
            this.close();
            return data;
        }

    });
    return ModalView;
});