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

    var EditorView = Backbone.View.extend({
        

        template: Handlebars.compile(template),

        initialize: function() {
            var self = this;
            this.constructor.__super__.initialize.apply(this, [this.options]);
            this.selectedLeft = 0;
            this.selectedRight = 0;
            this.grid = $('#grid')[0].getContext('2d');
            this.clickedLeft = false;
            this.clickedRight = false;
            this.img = new Image();
            this.img.src = SRC;
            this.showGrid = true;
            /*for loops outside functions*/
            for (var i = 0; i < NUM_TILES; ++i) {
              addTile(i);
            },
            for (var i = 0; i < 8; ++i) {
              for (var j = 0; j < 8; ++j) {
                grid.strokeRect(i*SIZE, j*SIZE, SIZE, SIZE);
              }
            },
            for (var i = 0; i < 8; ++i) {
              for (var j = 0; j < 8; ++j) {
                grid.strokeRect(i*SIZE, j*SIZE, SIZE, SIZE);
              }
            }
        },

        destroy: function() {
            this.off();
        },

        events: {
            'mousedown .tile':'tileClick'
        },

        render: function() {
        
            this.$el.empty().html(this.template({
            }));
            return this;
        },
        /*non-event functions*/
        addTile: function(i){
              var tiles = $('#tiles');

              var tile = $('<div>');
              tile.attr('id', i);
              tile.addClass('tile');

              if (i === selected) {
                tile.addClass('selected');
              }

              var xOffset = -i % COLS * SIZE;
              var yOffset = -Math.floor(i / COLS) * SIZE;

              tile.css({
                width: SIZE + 'px',
                height: SIZE + 'px',
                background: 'url(' + SRC + ') ' + xOffset + ' ' + yOffset
              });

              tiles.append(tile);
        },
        drawPiece:function(id, x, y) {
          var ctx = $('#map')[0].getContext('2d');

          var xOffset = id % COLS * SIZE;
          var yOffset = Math.floor(id / COLS) * SIZE;

          ctx.drawImage(img, xOffset, yOffset, SIZE, SIZE, x * SIZE, y * SIZE, SIZE, SIZE);
        },
        /*Event functions*/
        tileClick:function(e){
                      if (e.which == 1)
            selectedLeft = +$(this).attr('id');
          if (e.which == 3)
            selectedRight = +$(this).attr('id');

          $('.selected').removeClass('selected');
          $('#' + selectedLeft).addClass('selected');
          $('#' + selectedRight).addClass('selected');
        }
    return EditorView;
});
