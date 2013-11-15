define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'text!app/templates/editor.handlebars',
    'app/collections/maps',
    'app/models/map'
], function(
    $,
    _,
    Backbone,
    Handlebars,
    template,
    Maps,
    Map
) {
    
    var EditorView = Backbone.View.extend({

        template: Handlebars.compile(template),

        initialize: function() {
            this.constructor.__super__.initialize.apply(this, [this.options]);
            this.currentMap = this.options['id'];
            // Initialize editor constants
            this.SIZE = 40;
            this.NUM_TILES_BOTTOM = 44;
            this.NUM_TILES_MIIDLE = 72;
            this.NUM_TILES_UPPER = 8;
            this.NUM_TILES_EVENTS = 8;
            this.COLS = 8;
            this.SRCBOTTOM = '/static/images/bottom.png';
            this.SRCEVENTS = '/static/images/events.png';
            this.SRCMIDDLE = '/static/images/middle.png';
            this.SRCTOP = '/static/images/upper.png';
            this.EditorColums = 8;
            this.EditorRows = 8; 
            this.selectedLeft = 0;
            this.selectedRight = 0;
            this.showGrid = true;
            this.erase = false;
<<<<<<< HEAD
            // Defaults for new map
            if (_.isUndefined(this.currentMap)) {
                this.jsonMapObject = { 
                    "title": "",
                    "author": "",  
                    "width": 0,   
                    "height": 0,  
                    "x": 0,       
                    "y": 0,       
                    "events": [Event], 
                    "data": {
                        "bottom": [],  
                        "middle": [],  
                        "top": [],     
                    },
                    "env": ""    
                };
                for(i = 0; i < this.COLS; i++)
                {
                    this.jsonMapObject.data.top[i] = [];
                    this.jsonMapObject.data.middle[i] = [];
                    this.jsonMapObject.data.bottom[i] = [];
                }
                console.log("jsonMapObject");
                console.log(this.jsonMapObject);
            } else {
                // Load the map if we are editing a map
                this.currentMapData = new Map({id: this.currentMap})
                this.currentMapData.on('change', this.render, this);
                this.currentMapData.fetch();
=======
            this.jsonMapObject = { 
                "title": "",
                "author": "",  
                "width": 0,   
                "height": 0,  
                "x": 0,       
                "y": 0,       
                "data": {
                    "bottom": [],  
                    "middle": [],  
                    "top": [],     
                },
                "events": [], 
                "env": ""    
                };
            this.actionHistory = [];  
            this.actionHistoryIndex = 0;
            for(i = 0; i < this.COLS; i++)
            {
              this.jsonMapObject.data.top[i] = [];
              this.jsonMapObject.data.middle[i] = [];
              this.jsonMapObject.data.bottom[i] = [];
>>>>>>> 8b6f675f03b12a8984ae3927c1a8616c5da3afce
            }

            this.maps = new Maps();
            this.maps.on('change', this.render, this);
            this.maps.fetch();
        },

        destroy: function() {
            this.off();
        },

        events: {
            'mousedown .tile':'tileClick',
            'mousedown canvas':'drawTiletoMap',
            'click #toggle': 'toggleGrid',
            'click #saveMap': 'saveMapToServer',
            'click .tileSetSwitch': 'switchTiles',
            'click .funcSwitcher': 'changeFunctions'
        },

        render: function() {
            if (!_.isUndefined(this.currentMapData)) {
                if (!_.isUndefined(this.currentMapData.attributes.data)) {
                    var mapInfo = this.currentMapData.attributes;
                    // console.log($.parseJSON(this.currentMapData.attributes.data));
                    this.jsonMapObject = {
                        "title": mapInfo.title,
                        "author": "",  
                        "width": mapInfo.width,   
                        "height": mapInfo.height,  
                        "x": mapInfo.x,       
                        "y": mapInfo.y,       
                        "events": mapInfo.events, 
                        "data": $.parseJSON(mapInfo.data),
                        "env": "" 
                    }
                }
            }
            console.log("jsonMapObject");
            console.log(this.jsonMapObject);
            this.$el.empty().html(this.template({
            }));
            this.buildMapEditor();
            var self = this;
            setTimeout(function(){
                for (var i = 0; i < 8; ++i) {
                    for (var j = 0; j < 8; ++j) {
                        that.drawPiece(22, i, j, "tilesBottom");
                    }
                };
            },100);
            return this;
        },
        
        /*non-event functions*/
        addTile: function(i, source, key){
            if(key==="bottom")
            {
                var tiles = this.$('#tilesBottom');
            }
            if(key==="middle")
            {
                var tiles = this.$('#tilesMiddle');
            }
            if(key==="top")
            {
                var tiles = this.$('#tilesTop');
            }
            if(key==="events")
            {
                var tiles = this.$('#tilesEvents');
            }

            var tile = $('<div>');
            tile.attr('id', i);
            tile.addClass('tile');

            var xOffset = -i % this.COLS * this.SIZE;
            var yOffset = -Math.floor(i / this.COLS) * this.SIZE;
            tile.css({
                width: this.SIZE + 'px',
                height: this.SIZE + 'px',
                background: 'url(' + source + ') ' + xOffset + 'px ' + yOffset +'px'
            });
            if (i === this.selectedLeft || i===this.selectedRight) {
                tile.addClass('selected');
            }

            tiles.append(tile);
            if(i===38 && key==="bottom")
            {
                tile.hide();
            }
            if(i>=5 && key==="events")
            {
                tile.hide();
            }
        },
        drawPiece:function(id, x, y, tileSet) {
            if(tileSet =="tilesBottom")
            {
                var ctx = this.$('#mapBottom')[0].getContext('2d');
                var source = this.SRCBOTTOM;
                this.jsonMapObject.data.bottom[y][x]=parseInt(id);
            }
            else if(tileSet =="tilesMiddle")
            {
                var ctx = this.$('#mapMiddle')[0].getContext('2d');
                var source = this.SRCMIDDLE;
                this.jsonMapObject.data.middle[y][x]=parseInt(id);
            }
            else if(tileSet =="tilesTop")
            {
                var ctx = this.$('#mapTop')[0].getContext('2d');
                var source = this.SRCTOP;
                this.jsonMapObject.data.top[y][x]=parseInt(id);
            }
            else if(tileSet =="tilesEvents")
            {
                var xCoordinate = x;
                var yCoordinate = y;
                var ctx = this.$('#mapEvents')[0].getContext('2d');
                var source = this.SRCEVENTS;
                if(id==0)
                {
                    this.jsonMapObject.events.push(
                    {
                        "id": "treasure",
                        "x": xCoordinate,  
                        "y": yCoordinate,  
                        "item": Number   // the item the treasure box contains, figure out a way to set this
                    });
                }
                else if(id==1)
                {
                    this.jsonMapObject.events.push(
                    {
                        "id": "bush",
                        "x": xCoordinate,  
                        "y": yCoordinate   
                    });
                }
                else if(id==2||id==4)
                {
                    this.jsonMapObject.events.push(
                    {
                        "id": "hole",
                        "x": xCoordinate,  
                        "y": yCoordinate,  
                        "d_id": Number,  // the destination id of the map to send you to
                        "d_x":  Number,  // the destination x of where it sends you
                        "d_y":  Number,  // the destination y of where it sends you
                    });
                }
                else if(id==3)
                {
                    this.jsonMapObject.events.push(
                    {
                        "id": "door",
                        "x": xCoordinate,  // the x location of the door
                        "y": yCoordinate,  // the y location of the door
                        "d_id": Number,  // the destination id of the map to send you to
                        "d_x":  Number,  // the destination x of where it sends you
                        "d_y":  Number,  // the destination y of where it sends you
                    });
                }
            }
            var historyItem = {
                "layer": tileSet,
                "action": "add",
                "x": x,
                "y": y,
                "tileId": id
            };
            this.actionHistory.push(historyItem);
            var img=document.createElement('image');
            img.src=source;
            var xOffset = id % this.COLS * this.SIZE;
            var yOffset = Math.floor(id / this.COLS) * this.SIZE;
            ctx.drawImage(img, xOffset, yOffset, this.SIZE, this.SIZE, x * this.SIZE, y * this.SIZE, this.SIZE, this.SIZE);
        },
        /*Event Functions*/
        tileClick: function(e){
            if(this.erase)
            {
               $("#draw").click();
            }
            if (e.which == 1)
                this.selectedLeft = e.target.getAttribute('id');
            if (e.which == 3)
                this.selectedRight = e.target.getAttribute('id');
            $('.selected').removeClass('selected');
            $('#' + this.selectedLeft).addClass('selected');
            $('#' + this.selectedRight).addClass('selected');
        },
        buildMapEditor: function(){
            var clickedLeft = false;
            var clickedRight = false;
            var grid = this.$('.grid')[0].getContext('2d');
            var tileCount;
            var keys =["bottom", "middle", "top", "events"];
            for(var index in keys)
            {
                if(keys[index]==="bottom")
                {
                    source=this.SRCBOTTOM;
                    tileCount=this.NUM_TILES_BOTTOM;
                }
                else if(keys[index]==="middle")
                {
                    source=this.SRCMIDDLE;
                    tileCount=this.NUM_TILES_MIIDLE;
                }
                else if(keys[index]==="top")
                {
                    source=this.SRCTOP;
                    tileCount=this.NUM_TILES_UPPER;
                }
                else if(keys[index]==="events")
                {
                    source=this.SRCEVENTS;
                    tileCount=this.NUM_TILES_EVENTS;
                }
                for (var i = 0; i < tileCount; ++i) {
                    this.addTile(i, source, keys[index]);
                };
            }
            for (var i = 0; i < this.EditorColums; ++i) {
                for (var j = 0; j < this.EditorRows; ++j) {
                    grid.strokeRect(i*this.SIZE, j*this.SIZE, this.SIZE, this.SIZE);
                }
            };
            this.$('.tileSet').hide();
            this.$('.displayed').show();
            this.$('#draw').hide();
        },
        drawTiletoMap: function(e){
            var tileSet = this.$('.displayed').attr('id');
            if (!tileSet)
            {
                tileSet = "tilesBottom";
            }
            var clickedRight = false;
            var clickedLeft = false;
            if (e.which === 1) clickedLeft = true;
            if (e.which === 3) clickedRight = true;
            var x = Math.floor(e.offsetX / this.SIZE);
            var y = Math.floor(e.offsetY / this.SIZE);
            if(this.erase == true)
            {
                this.eraseTile(x,y);
                return false;
            }
            if (clickedLeft)
                this.drawPiece(this.selectedLeft, x, y, tileSet);
            else if (clickedRight)
                this.drawPiece(this.selectedRight, x, y, tileSet);
        },
        toggleGrid: function(){
            this.showGrid = !this.showGrid;
            var func = this.showGrid ? 'removeClass' : 'addClass';
            $('#grid')[func]('hidden');
        },
        saveMapToServer: function(){
            console.log(this.jsonMapObject);
            this.jsonMapObject.title = $('#mapTitle').val();
            this.jsonMapObject.author=USER;
            this.jsonMapObject.width = parseInt($('#mapBottom').attr('width'))/40;
            this.jsonMapObject.height = parseInt($('#mapBottom').attr('height'))/40;
            var self = this;
            $.post('/rest/save-map', {'map': JSON.stringify(this.jsonMapObject),
                                      'map_id': this.currentMap}, function(response){
                if (_.isUndefined(self.currentMap)) {

                } else {
                    self.currentMap = response['map_id']
                }
            });
        },
        switchTiles: function(e){
            var showSet = e.target.id;
            this.$('.displayed').hide().removeClass('displayed');
            if(showSet =="showBottomTiles")
            {
                this.$("#tilesBottom").addClass('displayed')
            }
            else if(showSet =="showMiddleTiles")
            {
                this.$("#tilesMiddle").addClass('displayed')
            }
            else if(showSet =="showTopTiles")
            {
                this.$("#tilesTop").addClass('displayed')
            }
            else if(showSet =="showEventTiles")
            {
                this.$("#tilesEvents").addClass('displayed')
            }
            this.$('.displayed').show();
        },
        changeFunctions: function(e)
        {
            if(e.target.id=="eraser")
            {
                this.erase = true;
                this.$('.mapEditorCanvas').css({cursor:"crosshair"});
                this.$('#eraser').hide();
                this.$('#draw').show();
            }
            if(e.target.id=="draw")
            {
                this.erase = false;
                this.$('.mapEditorCanvas').css({cursor: "default"});
                this.$('#eraser').show();
                this.$('#draw').hide();
            }
        },
        eraseTile: function(x, y)
        {
            if(this.findMatchingEvent(x,y))
            {
                var ctx = this.$('#mapEvents')[0].getContext('2d');
            }
            else if(this.jsonMapObject.data.top[y][x])
            {
                var ctx = this.$('#mapTop')[0].getContext('2d');
                this.jsonMapObject.data.top[y][x] = null;
            }
            else if(this.jsonMapObject.data.middle[y][x])
            {
                var ctx = this.$('#mapMiddle')[0].getContext('2d');
                this.jsonMapObject.data.middle[y][x] = null;
            }
            else if(this.jsonMapObject.data.bottom[y][x] != 22)
            {
                var ctx = this.$('#mapBottom')[0].getContext('2d');
                this.jsonMapObject.data.bottom[y][x] = 22;
                var source = this.SRCBOTTOM;
                var img=document.createElement('image');
                img.src=source;
                var xOffset = 22 % this.COLS * this.SIZE;
                var yOffset = Math.floor(22 / this.COLS) * this.SIZE;
                ctx.drawImage(img, xOffset, yOffset, this.SIZE, this.SIZE, x * this.SIZE, y * this.SIZE, this.SIZE, this.SIZE);
                return false;
            }
            if(!ctx)
            {
                return false;
            }
            ctx.clearRect(x*this.SIZE, y*this.SIZE, this.SIZE, this.SIZE)
        },
        findMatchingEvent: function(x, y)
        {
            var eventArray = this.jsonMapObject.events;
            for (eventObject in eventArray)
            {
                if(eventArray[eventObject].x == x && eventArray[eventObject].y == y)
                {
                    eventArray.splice(eventObject, 1);
                    return true;
                }
            }
            return false;
        }

    });
    return EditorView;
});
