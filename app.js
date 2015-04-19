(function() {
    var MultiVerse = function() {
        var express = require('express');
        var app = express();
        var http = require('http').Server(app);
        var io = require('socket.io')(http);
        var chatHistory = [],
            onlineUsers = 0;

        function setupSocketServerEvents(socket) {
            socket.on('disconnect', function() {
                var message = socket.username + " has disconnected";
                onlineUsers--;
                chatHistory.push({"name": "Server", "message": message})
                io.emit("data", {"chatHistory": chatHistory, "onlineUsers": onlineUsers});
            });

            socket.on("error", function(data) {
                console.log(data);
            });

            socket.on("data", function(data){
                if(data.name) {
                    socket.username = data.name;
                }

                if(data.message) {
                    chatHistory.push({"name": socket.username, "message": data.message});
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
                onlineUsers++;
                setTimeout(function() {
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
})();