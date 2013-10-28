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
    var SIZE = 40;
    var NUM_TILES = 44;
    var COLS = 8;
    var SRC = '/static/images/bottom.png';
    var selectedLeft = 0;
    var selectedRight = 0;

    var EditorView = Backbone.View.extend({

        template: Handlebars.compile(template),

        initialize: function() {
            var self = this;
            this.constructor.__super__.initialize.apply(this, [this.options]);
            this.render();
        },

        destroy: function() {
            this.off();
        },

        events: {
            'mousedown .tile':'tileClick',
            'mousedown canvas':'drawTiletoMap',
            'click #toggle': 'toggleGrid'
        },

        render: function() {
        
            this.$el.empty().html(this.template({
            }));
            this.buildMapEditor()
            return this;

        },
        /*non-event functions*/
        addTile: function(i){
              var tiles = this.$('#tiles');

              var tile = $('<div>');
              tile.attr('id', i);
              tile.addClass('tile');

              var xOffset = -i % COLS * SIZE;
              var yOffset = -Math.floor(i / COLS) * SIZE;

              tile.css({
                width: SIZE + 'px',
                height: SIZE + 'px',
                background: 'url(' + SRC + ') ' + xOffset + 'px ' + yOffset +'px'
              });
                if (i === selectedLeft) {
                  tile.addClass('selected');
                }

              tiles.append(tile);
        },
        drawPiece:function(id, x, y) {
          var ctx = this.$('#map')[0].getContext('2d');
          var img=document.createElement('image');
          img.src=SRC;
          var xOffset = id % COLS * SIZE;
          var yOffset = Math.floor(id / COLS) * SIZE;

          ctx.drawImage(img, xOffset, yOffset, SIZE, SIZE, x * SIZE, y * SIZE, SIZE, SIZE);
        },
        /*Event Functions*/
        tileClick: function(e){
          if (e.which == 1)
            selectedLeft = e.target.getAttribute('id');
          if (e.which == 3)
            selectedRight = e.target.getAttribute('id');

          $('.selected').removeClass('selected');
          $('#' + selectedLeft).addClass('selected');
          $('#' + selectedRight).addClass('selected');
        },
        buildMapEditor: function(){
          var clickedLeft = false;
          var clickedRight = false;
          var showGrid = true;
          var grid = this.$('.grid')[0].getContext('2d');
          var img = new Image();
          img.src = SRC;
          var self = this;
          /*img.onload = function () {
              $(document).mousedown(function (e) {
                    if (e.which === 1) clickedLeft = true;
                    if (e.which === 3) clickedRight = true;
                  });
              $(document).mouseup(function (e) {
                    if (e.which === 1) clickedLeft = false;
                    if (e.which === 3) clickedRight = false;
                  });
              self.$('#grid').mousemove(function (e) {
                    var x = Math.floor(e.offsetX / SIZE);
                    var y = Math.floor(e.offsetY / SIZE);

                    if (clickedLeft)
                      self.drawPiece(selectedLeft, x, y, this);
                    if (clickedRight)
                      self.drawPiece(selectedRight, x, y, this);
              });
            }*/
          /*for loops outside functions*/
            for (var i = 0; i < NUM_TILES; ++i) {
              this.addTile(i);
            };
            for (var i = 0; i < 8; ++i) {
              for (var j = 0; j < 8; ++j) {
                grid.strokeRect(i*SIZE, j*SIZE, SIZE, SIZE);
              }
            };
            
        },
      drawTiletoMap: function(e){
          var clickedRight = false;
          var clickedLeft = false;
          if (e.which === 1) clickedLeft = true;
          if (e.which === 3) clickedRight = true;
          var x = Math.floor(e.offsetX / SIZE);
          var y = Math.floor(e.offsetY / SIZE);
          if (clickedLeft)
              this.drawPiece(selectedLeft, x, y);
          else if (clickedRight)
              this.drawPiece(selectedRight, x, y);
      },
      toggleGrid: function(){
         this.showGrid = !this.showGrid;

        var func = this.showGrid ? 'removeClass' : 'addClass';

        $('#grid')[func]('hidden');
      }
        
    });
    return EditorView;
});
