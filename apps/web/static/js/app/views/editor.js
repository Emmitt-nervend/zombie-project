define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'text!app/templates/editor.handlebars'
], function(
    $,
    _,
    Backbone,
    Handlebars,
    template
) {
    var EditorView = Backbone.View.extend({

        template: Handlebars.compile(template),

        initialize: function() {
            var self = this;
            this.constructor.__super__.initialize.apply(this, [this.options]);
        },

        destroy: function() {
            this.off();
        },

        events: {
            'mousedown #selectionTool tr td': 'selectionMouseButton',
            'mousedown #mapViewer tr td': 'viewerMouseDown',
            'onload #SelectionCanvas': 'loadSelectionCanvas'
        },

        render: function() {
            this.$el.empty().html(this.template({
            }));
            return this;
        },
        selectionMouseButton: function(e) {
        switch (e.which) {
        case 1:
            $("#leftClickOption").html(e.target.getAttribute("val")).attr("val", e.target.getAttribute("val"));

            break;
        case 2:
            console.log("button 2");
            break;
        case 3:
           $("#rightClickOption").html(e.target.getAttribute("val")).attr("val", e.target.getAttribute("val"));
            break;
        default:
            alert('Error: No button identified');
            }
          },
          viewerMouseDown: function(e){
            switch(e.which){
                case 1:
                    if ($("#leftClickOption").attr("val")=="0")
                    {
                        break;
                    }
                    else
                    e.target.innerHTML = $("#leftClickOption").html();
                    break;
                case 2:
                    console.log("button 2");
                    break;
                case 3:
                 if ($("#rightClickOption").attr("val")=="0")
                    {
                        break;
                    }
                    e.target.innerHTML = $("#rightClickOption").html();
                    break;
            }
          },
          loadSelectionCanvas: function(){
            var clipx = 0;
            var clipy = 0;
            var printx = 0;
            var printy = 0;
            for(var i = 0; i<=43; i++){
                var canvas = '<canvas oncontextmenu = "return false" id="myCanvas"'+i' width="250" height="300" style="float:left;">'
                var context = canvas.getContext('2d');
                context.drawImage("bottom.png", clipx, clipy, 40, 40, printx, printy, 40, 40);
            }
                 
          }
    });
     
    return EditorView;
});
