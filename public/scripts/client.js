var socket;

(function() {
        var name,
            onlineUsers = [],
        userListOpen = false;

    function loginButtonClickHandler() {
        name = $('#name_input').val();

        if(name.length > 1) {
            setupConnection();
        } else {
            $('#guest_login h1').first().css("color", "red").html("Please enter a username");
        }
    }

    function onlineUsersClickHandler() {
        if(userListOpen) {
            userListOpen = false;
            $('#online_users_list').fadeOut();
            $('#online_users').animate({"height": "50px"});
        } else {
            userListOpen = true;
            $('#online_users').animate({"height": "100%"}, function() {
                $('#online_users_list').fadeIn();
            });
        }
    }

    function toggleRegistration() {
        if($('#guest_login:visible').length) {
            $('#guest_login').fadeOut(function() {
                $('#register_signup').fadeIn();
            });
        } else {
            $('#register_signup').fadeOut(function() {
                $('#guest_login').fadeIn();
            });
        }
    }

    function registerUser() {
        $('#register_signup h1').first().css("color", "red").html("Registration is currently offline");
    }

    function setupEvents() {
        $('#chat_input').on("keypress", function(event) {
            if(event.keyCode === 13) {
                socket.emit("data", {"message": $('#chat_input').val()});

                $('#chat_input').val("");
            }
        });

        $('#online_users').on("click", onlineUsersClickHandler);
        $('#login_button').on("click", loginButtonClickHandler);
        $('#register_strip span, #guest_strip span').on("click", toggleRegistration);
        $('#register_button').on("click", registerUser);
    }

    function setupConnection() {
        socket = io.connect();

        socket.on("connect", function(){
            ig.game.spawnEntity("EntityPlayer", 1500, 1500);

            var player = ig.game.getEntitiesByType( EntityPlayer )[0];
                player.name = name;

            socket.emit("data", {"name": name, "playerX": player.pos.x, "playerY": player.pos.y });

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
                onlineUsers = data.onlineUsers;
                $('#online_users_list').empty();
                $('#online_users').find('span').html(data.onlineUsers.length);

                for(var i = 0; i < data.onlineUsers.length; i++) {
                    $('#online_users_list').append('<li>' + data.onlineUsers[i].name + '</li>');

                    for(var i = 0; i < onlineUsers.length; i++) {
                        if(onlineUsers[i].name === data.onlineUsers[i].name) {
                            if(data.onlineUsers[i].name === name) {
                                continue;
                            } else {
                                //temp hack to get the users to appear
                                var newPlayer = ig.game.spawnEntity("EntityOtherPlayer", data.onlineUsers[i].x, data.onlineUsers[i].y);
                                    newPlayer.name = data.onlineUsers[i].name;

                                setTimeout(function() {
                                    newPlayer.kill();
                                },50);
                            }
                        }

                    }
                }
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
    });
})();