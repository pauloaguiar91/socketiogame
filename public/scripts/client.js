

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
        $("#blog_container .blog_view_toggle").on("mouseenter", function() { mouseHoverViewToggle($(this)) });
        $("#navbar ul li").on("click", function() { navigationClickHandler($(this).data("view")) });

        $('#UI_character').drags();


    }

    $(document).ready(function() {
        setupEvents();
    });
})();

function scrollChatFrameToBottom() {
    $("#chat_frame").scrollTop($("#chat_frame")[0].scrollHeight);
}


//draggable function
(function($) {
    $.fn.drags = function(opt) {

        opt = $.extend({
            handle: "",
            cursor: "pointer",
            draggableClass: "draggable",
            activeHandleClass: "active-handle",
            cancel: 'a,input,textarea,button,select,option'
        }, opt);

        var $selected = null;
        var $elements = (opt.handle === "") ? this : this.find(opt.handle);

        $elements.css('cursor', opt.cursor).on("mousedown", function(e) {
            var elIsCancel = e.target.nodeName ? $(e.target).closest(opt.cancel).length : false;

            if(opt.handle === "") {
                $selected = $(this);
                $selected.addClass(opt.draggableClass);
            } else {
                $selected = $(this).parent();
                $selected.addClass(opt.draggableClass).find(opt.handle).addClass(opt.activeHandleClass);
            }

            if (elIsCancel){
                return true;
            }

            var drg_h = $selected.outerHeight(),
                drg_w = $selected.outerWidth(),
                pos_y = $selected.offset().top + drg_h - e.pageY,
                pos_x = $selected.offset().left + drg_w - e.pageX;
            $(document).on("mousemove", function(e) {
                $selected.offset({
                    top: e.pageY + pos_y - drg_h,
                    left: e.pageX + pos_x - drg_w
                });
            }).on("mouseup", function() {
                $(this).off("mousemove"); // Unbind events from document
                if ($selected !== null) {
                    $selected.removeClass(opt.draggableClass);
                    $selected = null;
                }
            });
            e.preventDefault();
        }).on("mouseup", function() {
            if(opt.handle === "") {
                $selected.removeClass(opt.draggableClass);
            } else {
                $selected.removeClass(opt.draggableClass)
                    .find(opt.handle).removeClass(opt.activeHandleClass);
            }
            $selected = null;
        });

        return this;

    };
})(jQuery);