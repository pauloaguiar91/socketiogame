(function() {
    var MultiVerse = function() {
        var express = require('express');
        var app = express();
        var http = require('http').Server(app);
        var io = require('socket.io')(http);
        var chatHistory = [];
        var onlineUsers = 0;
        var user = {};

        function setupSocketServerEvents(socket) {
            socket.on('disconnect', function() {
                var message = "User Disconnected";
                onlineUsers--;

                chatHistory.push({"name": "Server", "message": message})
                io.emit('chatMessage', {"name": "Server", "message": message});
                io.emit('onlineUsers', onlineUsers);
            });

            socket.on('chatMessage', function(msg){
                chatHistory.push({"name": user.name, "message": msg});
                io.emit('chatMessage', {"name": user.name, "message": msg});
            });
        }

        function setupServer() {
            // Allows static files to be used in the /public directory
            app.use('/public', express.static(__dirname + '/public'));

            // Render index.html on /
            app.get('/', function(req, res){
                res.sendFile(__dirname + "/views/index.html");
            }); 

            app.get('/leveledit', function(req, res){
                res.sendFile(__dirname + "/views/weltmeister.html");
            });

            // Socket IO Connection
            io.on('connection', function(socket) {
                var message = "User Connected";
                onlineUsers++;
                chatHistory.push({"name": "Server", "message": message});

                io.emit('onlineUsers', onlineUsers);
                socket.emit("chatMessage", chatHistory);


                setupSocketServerEvents(socket);

            });

            http.listen(process.env.PORT || 3000, function(){
                console.log('listening on :3000');
            });
        }

        function setupUser() {
            user.name = "User";
        }

        this.init = function() {
            setupServer();
            setupUser();
        }
    }


    var m = new MultiVerse();
        m.init();
})();