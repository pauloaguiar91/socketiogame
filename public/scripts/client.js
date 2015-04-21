

(function() {
        var userListOpen = false;

    function loginButtonClickHandler() {
        var name = $("#name_input").val();

        if(name.length >= 1) {
            ig.game.setupConnection(name);
        } else {
            $("#guest_login h1").first().css("color", "red").html("Please enter a username");
        }
    }

    function onlineUsersClickHandler() {
        if(userListOpen) {
            userListOpen = false;
            $("#online_users_list").fadeOut();
            $("#online_users").animate({"height": "50px"});
        } else {
            userListOpen = true;
            $("#online_users").animate({"height": "100%"}, function() {
                $("#online_users_list").fadeIn();
            });
        }
    }

    function toggleRegistration() {
        if($("#guest_login:visible").length) {
            $("#guest_login").fadeOut(function() {
                $("#register_signup").fadeIn();
            });
        } else {
            $("#register_signup").fadeOut(function() {
                $("#guest_login").fadeIn();
            });
        }
    }

    function registerUser() {
        $("#register_signup h1").first().css("color", "red").html("Registration is currently offline");
    }

    function setupEvents() {
        $("#online_users").on("click", onlineUsersClickHandler);
        $("#login_button").on("click", loginButtonClickHandler);
        $("#register_strip span, #guest_strip span").on("click", toggleRegistration);
        $("#register_button").on("click", registerUser);
    }

    $(document).ready(function() {
        setupEvents();
    });
})();

function scrollChatFrameToBottom() {
    $("#chat_frame").scrollTop($("#chat_frame")[0].scrollHeight);
}