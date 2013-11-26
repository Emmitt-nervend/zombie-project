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
        
        submitEvent: function() {
            var self = this;
            var data = {
                value:"",
                mapId:"",
                mapName:"",
                d_x:"",
                d_y:""
            };
            if(this.$('#treasure').length > 0)
            {
                data.value = self.$("#treasure").find(":checked").attr('data-id');
            }
            else if(this.$('#transfer').length>0)
            {
                data.mapName = self.$('#mapList').val();
                data.mapId = self.$('#mapList').find(":selected").attr('data-id');
                data.d_x = self.$('#d_x').val();
                data.d_y = self.$('#d_y').val();
            }
            this.close();
            console.log(data);
            return data;
        }

    });
    return ModalView;
});