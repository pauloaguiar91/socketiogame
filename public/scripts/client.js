(function() {
    var socket;


    function setupEvents() {
        $('input').on("keypress", function(event) {
            if(event.keyCode === 13) {
                socket.emit('chatMessage', $('input').val());
                $('input').val("");
            }
        })
    }

    function setupConnection() {
        socket = io.connect();

        socket.on("connect", function(){
        });

        socket.on("connect_error", function(){
            $('#chat_frame').append('<p>Error connecting to server... Please refresh to try again</p>');
            socket.close();
        });

        socket.on("onlineUsers", function(users) {
           $('#online_users').find('span').html(users);
        });

        socket.on("error", function(event) {
            $('#chat_frame').append('<p>'+event+'</p>');
        });

        socket.on('chatMessage', function(msg) {
            if(msg instanceof Array) {
                for(var i = 0; i < msg.length; i++ ) {
                    $('#chat_frame').append('<p>'+ msg[i].name + ": " + msg[i].message+'</p>');
                }
            } else {
                $('#chat_frame').append('<p>'+ msg.name + ": " + msg.message+'</p>');
            }


            $('#chat_frame').scrollTop($("#chat_frame")[0].scrollHeight);

        });
    }


    $(document).ready(function() {
        setupConnection();
        setupEvents();
    })

})();