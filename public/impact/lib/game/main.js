ig.module( 
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
    'game.entities.player',
    'game.entities.otherplayer',
    'game.entities.playerbox',
    'game.levels.untitled'
)
.defines(function(){
        var dir = "/public/impact/",
            userStorage = [],
            savedChatHistory,
            onlineUserCount;

MultiVerse = ig.Game.extend({
    socket: null,
	font: new ig.Font( dir + 'media/04b03.font.png' ),

    resizeEventHandler: function() {
        ig.system.resize($(window).width(), $(window).height());
    },
	
	
	init: function() {
		// Initialize your game here; bind keys etc.
        this.loadLevel( LevelUntitled );
        this.screen.x = 1900;
        this.screen.y = 1500;
        ig.input.bind( ig.KEY.UP_ARROW, 'up' );
        ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
        ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
        ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );

        $(window).resize(this.resizeEventHandler);

        $("#chat_input").on("keypress", function(event) {
            if(event.keyCode === 13) {
                ig.game.socket.emit("data", { "message": $("#chat_input").val() });

                $("#chat_input").val("");
            }
        });
	},
	
	update: function() {
		this.parent();
	},
	
	draw: function() {
        this.parent();

        var player = this.getEntitiesByType( EntityPlayer )[0];
        if( player ) {
            var x = player.pos.x - ig.system.width / 2,
                y = player.pos.y - ig.system.height / 2;

            this.screen.x = x;
            this.screen.y = y;


            if(this.screen.x <= 0){
                this.screen.x = 0;
            }
            if(this.screen.y <= 0){
                this.screen.y = 0;
            }

            if(this.screen.x >= this.collisionMap.width * this.collisionMap.tilesize - ig.system.width){
                this.screen.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
            }

            if(this.screen.y >= this.collisionMap.height * this.collisionMap.tilesize - ig.system.height){
                this.screen.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;
            }

            this.font.size = 50;
            var nameX = player.pos.x - ig.game.screen.x;
            var nameY = player.pos.y - ig.game.screen.y;
            this.font.draw(player.name, nameX, nameY - 10, ig.Font.ALIGN.right );


            var otherPlayers = ig.game.getEntitiesByType(EntityOtherPlayer);

            for(var ii = 0; ii < otherPlayers.length ; ii++) {
                var otherX = otherPlayers[ii].pos.x - ig.game.screen.x;
                var otherY = otherPlayers[ii].pos.y - ig.game.screen.y;

                this.font.draw(otherPlayers[ii].name, otherX, otherY - 10, ig.Font.ALIGN.right );
            }
        }
	},

    setupConnection: function(name) {
        this.socket = io.connect();

        this.socket.on("connect", function() {
            var newPlayer = ig.game.spawnEntity("EntityPlayer", 4500, 4220, {"name": name} );

            ig.game.socket.emit("data", {"name": name, "x": newPlayer.pos.x, "y": newPlayer.pos.y });

            $("#logged_out, #navbar").fadeOut(function() {
                $("#logged_in").fadeIn();
            })
        });

        this.socket.on("connect_error", function(){
            $("#chat_frame").append("<p>Error connecting to server... Please refresh to try again</p>");
            this.socket.close();
        });

        this.socket.on("error", function(eventMessage) {
            $("#chat_frame").append("<p>"+eventMessage+"</p>");
        });

        this.socket.on("data", function(data) {
            if(data.onlineUsers) {
                var onlineUsers = data.onlineUsers;

                if(onlineUserCount !== data.onlineUsers.length) {
                    onlineUserCount = data.onlineUsers.length;

                    $("#online_users_list").empty();
                    $("#online_users").find("span").html(data.onlineUsers.length);

                    for(var i = 0; i < data.onlineUsers.length; i++) {
                        $("#online_users_list").append("<li>" + data.onlineUsers[i].name + "</li>");
                    }
                }

                //remove name from onlineUsers, so that storage doesnt pick it up
                for(var j = 0; j < onlineUsers.length; j++) {
                    if(onlineUsers[j].name === data.onlineUsers[j].name) {
                        if(onlineUsers[j].name === name) {
                            onlineUsers.splice(j, 1);
                        }
                    }
                }

                //ISSUE 1: Second entity is constantly overwritten. entityThisPass keeps returning true.
                //ISSUE 2: Need to remove entity
                //NOTE: Current movement patterns are SOLID
                var entities = [];

                for(var e = 0; e < ig.game.entities.length; e++) {
                    entities.push(ig.game.entities[e].name);
                }

                for(var j = 0; j < onlineUsers.length; j++) { // go through all onlineUsers

                    var entityThisPass = false; //start flag. No entities

                    for(var ii = 0; ii < userStorage.length; ii++) { //go through client saved entities

                        var existingIndex = $.inArray(userStorage[ii], entities); // if client saved entity is in online users

                        if(existingIndex) {

                            for(var ee = 0; ee < entities.length; ee++) { //go through entities and update coordinates

                                if(entities[ee] === userStorage[ii]) {
                                    var entity = ig.game.entities[(existingIndex)];

                                    entity.pos.x = onlineUsers[j].x;
                                    entity.pos.y = onlineUsers[j].y;

                                    entityThisPass = true;
                                }
                            }
                        } else {
                            entityThisPass = false;
                        }
                    }

                    if(!entityThisPass) {
                        var newPlayer = ig.game.spawnEntity("EntityOtherPlayer", data.onlineUsers[j].x, data.onlineUsers[j].y);
                            newPlayer.name = data.onlineUsers[j].name;

                        if(userStorage.length > 20)
                            return;

                        userStorage.push(newPlayer.name);
                        //console.log(userStorage)
                    }
                }
            }

            if(data.chatHistory) {
                if(savedChatHistory === data.chatHistory)
                    return;

                savedChatHistory === data.chatHistory;
                console.log(savedChatHistory)
                $("#chat_frame").empty();

                for(var i = 0; i < data.chatHistory.length; i++ ) {
                    $("#chat_frame").append("<p>"+ data.chatHistory[i].name + ": " + data.chatHistory[i].message+"</p>");
                }

                scrollChatFrameToBottom();
            }
        });

    },
});

ig.main( '#canvas', MultiVerse, 60, $(window).width(), $(window).height(), 1 );

});
