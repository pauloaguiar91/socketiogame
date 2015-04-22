

(function() {
        var userListOpen = false,
            buttonLock,
            currentView = 'index';

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

    function navigationClickHandler(view) {
        if(view === currentView || buttonLock)
            return;

        buttonLock = true;

        $(".site_view").fadeOut();

        switch(view) {
            case "index":
                currentView = "index";
                $("#logged_out").fadeIn( function() { buttonLock = false; } );
                break;
            case "blog":
                currentView = "blog";
                $("#blog_container").fadeIn( function() { buttonLock = false; } );
                break;
            case "community":
                currentView = "community";
                $("#forum_container").fadeIn( function() { buttonLock = false; } );
                break;

            default:
                break;
        }
    }

    function registerUser() {
        $("#register_signup h1").first().css("color", "red").html("Registration is currently offline");
    }

    function mouseHoverViewToggle(data) {
        if($("#blog_view_container:visible").length)
            return;

        var url = "/public/images/blog/" + data.data("id") + ".jpg";

        console.log(url)

        $("#blog_view_container").css({ "background-image": "url('"+url+"')", "top": data.offset().top + 30, "left": data.offset().left }).show(0);

        $("#blog_container .blog_view_toggle").on("mouseout", function() {
            $("#blog_view_container").fadeOut();
            $(this).off("mouseout", "#blog_container .blog_view_toggle");
        });
    }

    function setupEvents() {
        $("#online_users").on("click", onlineUsersClickHandler);
        $("#login_button").on("click", loginButtonClickHandler);
        $("#register_strip span, #guest_strip span").on("click", toggleRegistration);
        $("#register_button").on("click", registerUser);
        $("#blog_container .blog_view_toggle").on("mouseenter", function() { mouseHoverViewToggle($(this)) })
        $("#navbar ul li").on("click", function() { navigationClickHandler($(this).data("view")) })
    }

    $(document).ready(function() {
        setupEvents();
    });
})();

function scrollChatFrameToBottom() {
    $("#chat_frame").scrollTop($("#chat_frame")[0].scrollHeight);
}