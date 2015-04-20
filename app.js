(function() {
    var MultiVerse = function() {
        var express = require('express');
        var app = express();
        var http = require('http').Server(app);
        var io = require('socket.io')(http);
        var chatHistory = [],
            onlineUsers = [];

        function setupSocketServerEvents(socket) {
            socket.on('disconnect', function() {
                var message = socket.username + " has disconnected";

                for(var i = 0; i < onlineUsers.length; i++) {
                    if(onlineUsers[i].name == socket.username) {
                        onlineUsers.splice(i, 1);
                    }
                }

                chatHistory.push({"name": "Server", "message": message});
                io.emit("data", {"chatHistory": chatHistory, "onlineUsers": onlineUsers});
            });

            socket.on("error", function(data) {
                //probably need a better way to store this data... maybe filesystem access logs...
                console.log(data);
            });

            socket.on("data", function(data) {
                if(data.name) {
                    socket.username = data.name;
                    socket.x = data.x;
                    socket.y = data.y;

                    for(var i = 0; i < onlineUsers.length; i++) {
                        if(onlineUsers[i].name == socket.username) {
                            onlineUsers[i].x = socket.x;
                            onlineUsers[i].y = socket.y;

                            socket.emit("data", {"onlineUsers": onlineUsers});
                        }
                    }
                }

                if(data.message) {
                    chatHistory.push({"name": socket.username, "message": data.message});

                    if(chatHistory.length > 100) {
                        chatHistory.shift();
                    }

                    io.emit("data", {"chatHistory": chatHistory});
                }
            });
        }

        function setupServer() {
            // Allows static files to be used in the /public directory
            app.use('/public', express.static(__dirname + '/public'));

            // Render index.html on /
            app.get('/', function(req, res){
                res.sendFile(__dirname + "/index.html");
            });

            // Socket IO Connection
            io.on('connection', function(socket) {
                setupSocketServerEvents(socket);

                setTimeout(function() {
                    onlineUsers.push( { "name": socket.username, "x": socket.x, "y": socket.y } );
                    var message = socket.username + "  has connected";
                    chatHistory.push({"name": "Server", "message": message});


                    io.emit("data", {"onlineUsers": onlineUsers, "chatHistory": chatHistory});
                }, 500);
            });

            http.listen(process.env.PORT || 3000, function(){
                console.log('listening on :3000');
            });
        }

        this.init = function() {
            setupServer();
        }
    }

    var m = new MultiVerse();
        m.init();

    //Remove element in array by string name.
    Array.prototype.remove = function(elem, all) {
        for (var i=this.length-1; i>=0; i--) {
            if (this[i] === elem) {
                this.splice(i, 1);
                if(!all)
                    break;
            }
        }
        return this;
    };
})();