(function() {
    var socket,
        name;


    function loginButtonClickHandler() {
        name = $('#name_input').val();

        setupConnection();
    }

    function setupEvents() {
        $('#chat_input').on("keypress", function(event) {
            if(event.keyCode === 13) {
                socket.emit("data", {"message": $('#chat_input').val()});

                $('#chat_input').val("");
            }
        });

        $('#login_button').on("click", loginButtonClickHandler);
    }

    function setupConnection() {
        socket = io.connect();

        socket.on("connect", function(){
            socket.emit("data", {"name": name});

            $('#logged_out').fadeOut(function() {
                $("#logged_in").fadeIn();
            })
        });

        socket.on("connect_error", function(){
            $('#chat_frame').append('<p>Error connecting to server... Please refresh to try again</p>');
            socket.close();
        });

        socket.on("error", function(eventMessage) {
            $('#chat_frame').append('<p>'+eventMessage+'</p>');
        });

        socket.on("data", function(data) {
            if(data.onlineUsers) {
                $('#online_users').find('span').html(data.onlineUsers);
            }

            if(data.chatHistory) {
                $('#chat_frame').empty();

                for(var i = 0; i < data.chatHistory.length; i++ ) {
                    $('#chat_frame').append('<p>'+ data.chatHistory[i].name + ": " + data.chatHistory[i].message+'</p>');
                }

                scrollChatFrameToBottom();
            }
        });
    }

    function scrollChatFrameToBottom() {
        $('#chat_frame').scrollTop($("#chat_frame")[0].scrollHeight);
    }

    $(document).ready(function() {
        setupEvents();
    })

})();