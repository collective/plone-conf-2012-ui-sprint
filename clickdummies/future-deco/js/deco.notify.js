/**
 * jQuery.decoNotify
 * 
 * @projectDescription  This plugin is used to display notifications
 * @author              Rob Gietema
 * @version             0.1
 *
 * @id jQuery.decoNotify
 * @id jQuery.fn.decoNotify
 */
;(function($){

    $.decoNotifications = function (title, message) {
        $("body").append(
            $(document.createElement("div"))
                .addClass("deco-notifications")
        )
    };

    $.decoNotify = function (type, title, message) {

        // Get last notification
        var last_notification = $(".deco-notifications").children("div:last");
        var offset_top = last_notification.length > 0 ? parseInt(last_notification.css("top")) + last_notification.height() + 10 : 0;

        // Add notification
        $(".deco-notifications")
            .append($(document.createElement("div"))
                .addClass("deco-notification")
                .append($(document.createElement("div"))
                    .addClass("deco-notification-header")
                )
                .append($(document.createElement("div"))
                    .addClass("deco-notification-content")
                    .append($(document.createElement("div"))
                        .addClass("deco-notification-type deco-notification-type-" + type)
                    )
                    .append($(document.createElement("div"))
                        .addClass("deco-notification-close")
                        .click(function () {
                            $(this).parents(".deco-notification")
                                .data('close', true)
                                .fadeOut("slow", function () {
                                    $(this).remove();
                                })
                        })
                    )
                    .append($(document.createElement("div"))
                        .addClass("deco-notification-text")
                        .append($(document.createElement("div"))
                            .addClass("deco-notification-title")
                            .html(title)
                        )
                        .append($(document.createElement("div"))
                            .addClass("deco-notification-message")
                            .html(message)
                        )
                    )
                )
                .append($(document.createElement("div"))
                    .addClass("deco-notification-footer")
                )
                .hide()
                .css("top", offset_top)
                .fadeIn("slow", function () {
                    var elm = $(this);
                    window.setTimeout(function () {
                        if (elm.data("mouseover") == false) {
                            elm.fadeOut("slow", function () {
                                elm.remove();
                            });
                        }
                        elm.data("timeout", true);
                    }, 3000);
                    elm.data("timeout", false);
                    elm.data('mouseover', false);
                    elm.data('close', false);
                })
                .mouseover(function () {
                    if ($(this).data("close") == false) {
                        window.clearTimeout($(this).data('fade'));
                        $(this).stop();
                        $(this).fadeTo("slow", 1);
                        $(this).data('mouseover', true);
                    }
                })
                .bind("mouseleave", function () {

                    // Get element
                    elm = $(this);
                    if ((elm.data("timeout") == true) && (elm.data("close") == false)) {
                        elm.fadeOut("slow", function () {
                            elm.remove();
                        });
                    }
                    $(this).data('mouseover', false);
                })
            )
    };
})(jQuery);