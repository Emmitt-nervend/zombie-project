define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'text!app/templates/editor.handlebars',
    'text!app/templates/modal.handlebars',
    'app/collections/maps',
    'app/models/map',
    'backbone-modal'
], function(
    $,
    _,
    Backbone,
    Handlebars,
    template,
    modalTemplate,
    Maps,
    Map
) {
    
    var EditorView = Backbone.View.extend({

        template: Handlebars.compile(template),

        modalTemplate: Handlebars.compile(template),

        initialize: function() {
            this.constructor.__super__.initialize.apply(this, [this.options]);
            this.currentMap = this.options['id'];
            _.bindAll(this);
            $(document).bind('keydown', this.keypressed);
            $(document).bind(setInterval(this.saveAfterTime, 5000));
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
            this.EditorColums = 15;
            this.EditorRows = 15; 
            this.selectedLeft = 0;
            this.selectedRight = 0;
            this.showGrid = true;
            this.erase = false;
            this.copy = false;
            this.pasteTiles = [];
            // Defaults for new map
            if (_.isUndefined(this.currentMap)) {
                    this.jsonMapObject = { 
                    "title": "",
                    "author": "",  
                    "width": 0,   
                    "height": 0,  
                    "x": 4,       
                    "y": 4,       
                    "events": [], 
                    "data": {
                        "bottom": [],  
                        "middle": [],  
                        "top": [],     
                    },
                    "env": "normal"    
                };
                for(i = 0; i < this.EditorColums; i++)
                {
                    this.jsonMapObject.data.top[i] = [];
                    this.jsonMapObject.data.middle[i] = [];
                    this.jsonMapObject.data.bottom[i] = [];
                }
            } else {
                // Load the map if we are editing a map
                this.currentMapData = new Map({id: this.currentMap})
                this.currentMapData.on('change', this.render, this);
                this.currentMapData.fetch();
            }
            this.actionHistory = [];  
            this.undoneActions = [];
            this.actionHistoryIndex = 0;
            this.maps = new Maps();
            this.maps.on('change', this.render, this);
            this.maps.fetch();
            this.mapSaved = true;
            this.mouseIsDown = false;
        },

        destroy: function() {
            this.off();
        },

        events: {
            'mousedown .tile':'tileClick',
            'mousedown canvas':'drawTiletoMap',
            // 'mousemove canvas': 'mouseMove',
            'mouseup canvas': 'mouseUp',
            'click #toggle': 'toggleGrid',
            'click #saveMap': 'saveMapToServer',
            'click #playMap': 'playMap',
            'click .tileSetSwitch': 'switchTiles',
            'click .funcSwitcher': 'changeFunctions',
            'click .historyAction': 'historyAction',
            'click .toolbox-toggle': 'toggleToolbox',
            'click #copy': 'preparecopy',
            'click #paste': 'preparePaste'
        },

        render: function() {
            if (!_.isUndefined(this.currentMapData)) {
                if (!_.isUndefined(this.currentMapData.attributes.data)) {
                    var mapInfo = this.currentMapData.attributes;
                    this.jsonMapObject = {
                        "title": mapInfo.title,
                        "author": "",  
                        "width": mapInfo.width,   
                        "height": mapInfo.height,  
                        "x": mapInfo.x,       
                        "y": mapInfo.y,       
                        "events": $.parseJSON(mapInfo.events), 
                        "data": $.parseJSON(mapInfo.data),
                        "env": "" 
                    }
                }
            }

            this.$el.empty().html(this.template({
            }));

            this.buildMapEditor();
            var self = this;
            if (_.isUndefined(this.currentMap)) {
                setTimeout(function(){
                    for (var i = 0; i < self.EditorColums; ++i) {
                        for (var j = 0; j < self.EditorRows; ++j) {
                            self.drawPiece(22, i, j, "tilesBottom", false);
                        }
                    };
                },100);

            } else if (!_.isUndefined(this.jsonMapObject)) {
                setTimeout(function() {
                    for (var i = 0; i < self.EditorColums; ++i) {
                        for (var j = 0; j < self.EditorRows; ++j) {
                            self.drawPiece(self.jsonMapObject.data.bottom[j][i], i, j, "tilesBottom", false)
                        }
                    }
                    for (var i = 0; i < self.EditorColums; ++i) {
                        for (var j = 0; j < self.EditorRows; ++j) {
                            if(self.jsonMapObject.data.middle[j][i])
                            {
                                self.drawPiece(self.jsonMapObject.data.middle[j][i], i, j, "tilesMiddle", false)
                            }
                        }
                    }
                    for (var i = 0; i < self.EditorColums; ++i) {
                        for (var j = 0; j < self.EditorRows; ++j) {
                            if(self.jsonMapObject.data.top[j][i])
                            {
                                self.drawPiece(self.jsonMapObject.data.top[j][i], i, j, "tilesTop", false)
                            }
                        }
                    }
                    for (var i = 0; i < self.EditorColums; ++i) {
                         for (var j = 0; j < self.EditorRows; ++j) {
                            var eventIndex = self.findMatchingEvent(i,j);
                            if(eventIndex>=0)
                            {
                                var tileId;
                                var eventId=self.jsonMapObject.events[eventIndex].id;
                                if(eventId=="treasure")
                                {
                                    tileId=0;
                                }
                                else if(eventId=="bush")
                                {
                                    tileId=1;
                                }
                                else if(eventId=="hole"||id==4)
                                {
                                    tileId=2;
                                }
                                else if(eventId=="door")
                                {Index
                                    tileId=3;
                                }
                                self.jsonMapObject.events.splice(eventIndex, 1);
                                self.drawPiece(tileId, i, j, "tilesEvents", false)
                            }
                         }
                     }
                    console.log(self.jsonMapObject);
                    $('#mapTitle').val(self.jsonMapObject.title);
                }, 100);
            }
            $("#toolbox").hide();
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
        drawPiece:function(id, x, y, tileSet, addEventToHistory) {
            if(tileSet =="tilesBottom")
            {
                var ctx = this.$('#mapBottom')[0].getContext('2d');
                var source = this.SRCBOTTOM;
                var previousValue = this.jsonMapObject.data.bottom[y][x];
                this.jsonMapObject.data.bottom[y][x]=parseInt(id);
            }
            else if(tileSet =="tilesMiddle")
            {
                var ctx = this.$('#mapMiddle')[0].getContext('2d');
                var source = this.SRCMIDDLE;
                var previousValue = this.jsonMapObject.data.middle[y][x];
                this.jsonMapObject.data.middle[y][x]=parseInt(id);
            }
            else if(tileSet =="tilesTop")
            {
                var ctx = this.$('#mapTop')[0].getContext('2d');
                var source = this.SRCTOP;
                var previousValue = this.jsonMapObject.data.bottom[y][x];
                this.jsonMapObject.data.top[y][x]=parseInt(id);
            }
            else if(tileSet =="tilesEvents")
            {Modal
                console.log(this.maps);
                var Modal = Backbone.Modal.extend({
                    template: _.template($('#modal-template').html()),
                    cancelEl: '.bbm-button'
                });

                var modalView = new Modal();
                $('#modal').html(modalView.render().el);

                var xCoordinate = x;
                var yCoordinate = y;
                var ctx = this.$('#mapEvents')[0].getContext('2d');
                var source = this.SRCEVENTS;
                var previousValue = this.jsonMapObject.events[this.findMatchingEvent(x,y)];
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
                else if(id==2)
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
                else if(id==3||id==4)
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
            if(addEventToHistory)
            {
                var historyItem = {
                    "layer": tileSet,
                    "action": "add",
                    "x": x,
                    "y": y,
                    "tileId": id,
                    "previousValue": previousValue
                };
                this.actionHistory[this.actionHistoryIndex] = historyItem;
                this.actionHistoryIndex++;
            }
            var img=document.createElement('image');
            img.src=source;
            var xOffset = id % this.COLS * this.SIZE;
            var yOffset = Math.floor(id / this.COLS) * this.SIZE;
            ctx.drawImage(img, xOffset, yOffset, this.SIZE, this.SIZE, x * this.SIZE, y * this.SIZE, this.SIZE, this.SIZE);
        },
        /*Event Functions*/
        saveAfterTime: function (e) {
            if(this.mapSaved == false){
                console.log("TIME TO SAVE!!!!!!!!");
                this.saveMapToServer();
                this.mapSaved = true;
            }
        },

        tileClick: function(e){
            if(this.erase)
            {
               $("#draw").click();
            }
            var tileSet = this.$('.displayed').attr('id');
            if(tileSet=="tilesBottom")
            {
                var source=this.SRCBOTTOM;
            }
            else if(tileSet=="tilesMiddle")
            {
                var source=this.SRCMIDDLE;   
            }
            else if(tileSet=="tilesTop")
            {
                var source=this.SRCTOP;
            }
            else if(tileSet=="tilesEvents")
            {
                var source=this.SRCEVENTS
            }

            if (e.which == 1)
            {
                this.selectedLeft = e.target.getAttribute('id');
                var ctx = this.$('#leftClickTile')[0].getContext('2d');
                var id = this.selectedLeft;
            }
            if (e.which == 3)
            {
                this.selectedRight = e.target.getAttribute('id');
                var ctx = this.$('#rightClickTile')[0].getContext('2d');
                var id = this.selectedRight;
            }
            $('.selected').removeClass('selected');
            $('#' + this.selectedLeft).addClass('selected');
            $('#' + this.selectedRight).addClass('selected');
            var img=document.createElement('image');
            img.src=source;
            var xOffset = id % this.COLS * this.SIZE;
            var yOffset = Math.floor(id / this.COLS) * this.SIZE;
            ctx.drawImage(img, xOffset, yOffset, this.SIZE, this.SIZE, 0, 0, this.SIZE, this.SIZE);
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
        mouseUp: function (e) {
            this.mouseIsDown = false;
        },
        mouseMove: function (e) {
            if (this.mouseIsDown == true){
                this.drawTiletoMap(e);
            }
        },
        drawTiletoMap: function(e){
            this.mapSaved = false
            this.mouseIsDown = true;
            console.log("MOUSEMOVE");
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
            if(this.erase)
            {
                this.eraseTile(x,y, true);
                return false;
            }
            if(this.copy)
            {
                this.copyFunction(x,y);
                return false;
            }
            if(this.paste)
            {
                this.pasteTile(x,y);
                return false;
            }
            if (clickedLeft)
                this.drawPiece(this.selectedLeft, x, y, tileSet, true);
            else if (clickedRight)
                this.drawPiece(this.selectedRight, x, y, tileSet, true);
        },
        toggleGrid: function(){
            this.showGrid = !this.showGrid;
            var func = this.showGrid ? 'removeClass' : 'addClass';
            $('#grid')[func]('hidden');
        },
        playMap: function(){
            this.jsonMapObject.title = $('#mapTitle').val();
            this.jsonMapObject.author=USER;
            this.jsonMapObject.width = parseInt($('#mapBottom').attr('width'))/40;
            this.jsonMapObject.height = parseInt($('#mapBottom').attr('height'))/40;
            var self = this;
            if (!_.isUndefined(this.currentMap)) {
                data = {'map': JSON.stringify(this.jsonMapObject), 'map_id': this.currentMap}
            } else {
                data = {'map': JSON.stringify(this.jsonMapObject)}
            }
            $.post('/rest/play-map', data, function(response){
                if (_.isUndefined(self.currentMap)) {
                    // this.currentMap = response
                    self.currentMap = response['map_id'];
                    Backbone.history.navigate('#map-editor/'+response['map_id'])
                } else {
                    self.currentMap = response['map_id']
                }
            });
        },
        saveMapToServer: function(){
            this.jsonMapObject.title = $('#mapTitle').val();
            this.jsonMapObject.author=USER;
            this.jsonMapObject.width = parseInt($('#mapBottom').attr('width'))/40;
            this.jsonMapObject.height = parseInt($('#mapBottom').attr('height'))/40;
            var self = this;
            if (!_.isUndefined(this.currentMap)) {
                data = {'map': JSON.stringify(this.jsonMapObject), 'map_id': this.currentMap}
            } else {
                data = {'map': JSON.stringify(this.jsonMapObject)}
            }
            $.post('/rest/save-map', data, function(response){
                if (_.isUndefined(self.currentMap)) {
                    // this.currentMap = response
                    self.currentMap = response['map_id'];
                    Backbone.history.navigate('#map-editor/'+response['map_id'])
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
                this.copy = false;
                this.paste = false;
                this.$('.mapEditorCanvas').css({cursor:"crosshair"});
                this.$('#eraser').hide();
                this.$('#draw').show();
            }
            if(e.target.id=="draw")
            {
                this.erase = false;
                this.copy = false;
                this.paste = false;
                this.$('.mapEditorCanvas').css({cursor: "default"});
                this.$('#eraser').show();
                this.$('#draw').hide();
            }
        },
        eraseTile: function(x, y, addEventToHistory)
        {
            var eventIndex = this.findMatchingEvent(x,y);
            if(eventIndex>=0)
            {
                var id = this.jsonMapObject.events[eventIndex];
                this.jsonMapObject.events.splice(eventIndex, 1);
                var ctx = this.$('#mapEvents')[0].getContext('2d');
                var tileSet = "tilesEvents";
            }
            else if(this.jsonMapObject.data.top[y][x])
            {
                var id = this.jsonMapObject.data.top[y][x];
                var ctx = this.$('#mapTop')[0].getContext('2d');
                this.jsonMapObject.data.top[y][x] = null;
                var tileSet = "tilesTop";
            }
            else if(this.jsonMapObject.data.middle[y][x])
            {
                var id = this.jsonMapObject.data.middle[y][x];
                var ctx = this.$('#mapMiddle')[0].getContext('2d');
                this.jsonMapObject.data.middle[y][x] = null;
                var tileSet = "tilesMiddle";
            }
            else if(this.jsonMapObject.data.bottom[y][x] != 22)
            {
                var id = this.jsonMapObject.data.bottom[y][x];
                var ctx = this.$('#mapBottom')[0].getContext('2d');
                this.jsonMapObject.data.bottom[y][x] = 22;
                var source = this.SRCBOTTOM;
                var img=document.createElement('image');
                img.src=source;
                var xOffset = 22 % this.COLS * this.SIZE;
                var yOffset = Math.floor(22 / this.COLS) * this.SIZE;
                ctx.drawImage(img, xOffset, yOffset, this.SIZE, this.SIZE, x * this.SIZE, y * this.SIZE, this.SIZE, this.SIZE);
                if(addEventToHistory)
                {
                    var historyItem = {
                        "layer": "tilesBottom",
                        "action": "erase",
                        "x": x,
                        "y": y,
                        "tileId": id
                    };
                    this.actionHistory[this.actionHistoryIndex] = historyItem;
                    this.actionHistoryIndex++;
                }
                return false;
            }
            if(!ctx)
            {
                return false;
            }
            if(addEventToHistory)
            {
                var historyItem = {
                    "layer": tileSet,
                    "action": "erase",
                    "x": x,
                    "y": y,
                    "tileId": id
                };
                this.actionHistory[this.actionHistoryIndex]=historyItem;
                this.actionHistoryIndex++;
            }
            ctx.clearRect(x*this.SIZE, y*this.SIZE, this.SIZE, this.SIZE)
        },
        findMatchingEvent: function(x, y) {
            var eventArray = this.jsonMapObject.events;
            for (eventObject in eventArray)
            {
                if(eventArray[eventObject].x == x && eventArray[eventObject].y == y)
                {
                    return eventObject;
                }
            }
            return -1;
        },
        historyAction: function(e)
        {
            var funct = e.target.id;
            var call = funct =="undo" ? this.undo() : this.redo(); 
        },
        undo: function()
        {
            if(this.actionHistoryIndex<=0)
            {
                console.log("Can't undo anymore.");
                return false;
            }
            var self = this;
            var lastAction=this.actionHistory[this.actionHistoryIndex-1];
            this.undoneActions.unshift(lastAction);
            this.actionHistory.splice(this.actionHistoryIndex-1, 1)
            if(lastAction.action=="erase")
            {
                self.drawPiece(lastAction.tileId, lastAction.x, lastAction.y, lastAction.layer, false);
                
            }
            else if(lastAction.action=="add")
            {
                if(lastAction.previousValue)
                {
                    self.drawPiece(lastAction.previousValue, lastAction.x, lastAction.y, lastAction.layer, false);
                }
                else
                {
                    self.undoTileAdd(lastAction.x, lastAction.y, lastAction.layer, lastAction.tileId, false)
                }
            }
            self.actionHistoryIndex--;
        },
        undoTileAdd: function(x, y, layer, id, addEventToHistory)
        {
            if(layer=="tilesEvents")
            {
                var eventIndex = this.findMatchingEvent(x,y);
                this.jsonMapObject.events.splice(eventIndex, 1);
                var ctx = this.$('#mapEvents')[0].getContext('2d');
            }
            else if(layer=="tilesTop")
            {
                var ctx = this.$('#mapTop')[0].getContext('2d');
            }
            else if(layer=="tilesMiddle")
            {
                var ctx = this.$('#mapTop')[0].getContext('2d');
            }
            if(addEventToHistory)
            {
                var historyItem = {
                    "layer": layer,
                    "action": "erase",
                    "x": x,
                    "y": y,
                    "tileId": id
                };
                this.actionHistory[this.actionHistoryIndex]=historyItem;
                this.actionHistoryIndex++;
            }
            ctx.clearRect(x*this.SIZE, y*this.SIZE, this.SIZE, this.SIZE)
        },
        redo: function()
        {
            var self = this;
            var nextAction=this.undoneActions[0];
            if(nextAction.action=="erase")
            {
                self.undoTileAdd(nextAction.x, nextAction.y, nextAction.layer, nextAction.tileId, true);
            }
            else if(nextAction.action=="add")
            {
                self.drawPiece(parseInt(nextAction.tileId), nextAction.x, nextAction.y, nextAction.layer, true);
            }
            this.undoneActions.splice(0,1);
        },
        toggleToolbox: function(e) {
            console.log("here");
            $("#toolbox").toggle("slide", {direction: "up"});
        },

        keypressed: function(e) {
            this.mapSaved = false
            console.log(e.which);
            if(e.which==71 && e.ctrlKey){ //ctrl + g
                e.preventDefault();
                this.toggleGrid();
            }
            if(e.which==83 && e.ctrlKey){ //ctrl + s
                e.preventDefault();
                this.saveMapToServer();
            }
            if(e.which==80 && e.ctrlKey){ //ctrl + p
                e.preventDefault();
                this.$('#playMap').click();
            }
            if(e.which==67 && e.ctrlKey){ //ctrl + c
                e.preventDefault();
                this.$('#copy').click();
            }
            if(e.which==86 && e.ctrlKey){ //ctrl + v
                e.preventDefault();
                this.$('#paste').click();
            }
            if(e.which==90 && e.ctrlKey){ //ctrl + z
                e.preventDefault();
                this.$('#undo').click();
            }
            if(e.which==88 && e.ctrlKey){ //ctrl + x
                e.preventDefault();
                this.$('#redo').click();
            }
            if(e.which==68 && e.ctrlKey){ //ctrl + d
                e.preventDefault();
                this.$('#draw').click();
            }
            if(e.which==69 && e.ctrlKey){ //ctrl + e
                e.preventDefault();
                this.$('#eraser').click();
            }
            if(e.which==53 && e.ctrlKey){ //ctrl + 5
                e.preventDefault();
                this.$('#toolBoxToggle').click();
            }
            if(e.which==49 && e.ctrlKey){ //ctrl + 1
                e.preventDefault();
                this.$('#showBottomTiles').click();
            }
            if(e.which==50 && e.ctrlKey){ //ctrl + 2
                e.preventDefault();
                this.$('#showMiddleTiles').click();
            }
            if(e.which==51 && e.ctrlKey){ //ctrl + 3
                e.preventDefault();
                this.$('#showTopTiles').click();
            }
            if(e.which==52 && e.ctrlKey){ //ctrl + 4
                e.preventDefault();
                this.$('#showEventTiles').click();
            }

        },
        preparecopy: function()
        {
            this.copy = true;
            this.erase = false;
            this.paste = false;
            this.pasteTiles=[];
        },
        preparePaste: function()
        {   
            this.$('.mapEditorCanvas').css({cursor:"crosshair"});
            this.copy = false;
            this.erase =false;
            this.paste = true;
        },
        pasteTile: function(x,y)
        {
            var self =this;
            var xBase = x>this.pasteTiles[0].x ? x-this.pasteTiles[0].x : this.pasteTiles[0].x-x;
            var yBase = y>this.pasteTiles[0].y ? y-this.pasteTiles[0].y : this.pasteTiles[0].y-y;
            var shiftDown =  x > this.pasteTiles[0].x ? true : false;
            var shiftRight =  y > this.pasteTiles[0].y ? true : false;
            this.pasteTiles.forEach(function(newTile){
                var newX = shiftDown ? newTile.x+xBase : newTile.x-xBase;
                var newY = shiftRight ? newTile.y + yBase : newTile.y - yBase
                self.drawPiece(newTile.id, newX, newY, newTile.tileSet, true)
            })
            this.$('.mapEditorCanvas').css({cursor:"default"});
            ctx = this.$('#copyCanvas')[0].getContext('2d');
            for (var i = 0; i < this.EditorColums; ++i) {
                for (var j = 0; j < this.EditorRows; ++j) {
                    ctx.clearRect(i*this.SIZE, j*this.SIZE, this.SIZE, this.SIZE);
                }
            };
            this.paste = false;
        },
        copyFunction: function(x,y)
        {
            if(this.jsonMapObject.data.top[y][x])
            {
                var id = this.jsonMapObject.data.top[y][x];
                var tileSet = "tilesTop";
                 var copyTile = {
                    "id": id,
                    "x": x,
                    "y": y,
                    "tileSet": tileSet
                }
                this.pasteTiles.push(copyTile);
            }
            if(this.jsonMapObject.data.middle[y][x])
            {
                var id = this.jsonMapObject.data.middle[y][x];
                var tileSet = "tilesMiddle";
                var copyTile = {
                    "id": id,
                    "x": x,
                    "y": y,
                    "tileSet": tileSet
                }
                this.pasteTiles.push(copyTile);
            }
            var id = this.jsonMapObject.data.bottom[y][x];
            var tileSet = "tilesBottom";
            var copyTile = {
                "id": id,
                "x": x,
                "y": y,
                "tileSet": tileSet
            }
            this.pasteTiles.push(copyTile);
            ctx = this.$('#copyCanvas')[0].getContext('2d');
            ctx.strokeStyle = '#ff0000';
            ctx.strokeRect(x*this.SIZE, y*this.SIZE, this.SIZE, this.SIZE);
        }
    });
    return EditorView;
});