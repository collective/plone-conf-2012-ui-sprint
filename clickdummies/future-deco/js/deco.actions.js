/**
 * jQuery.decoActionManager
 * 
 * @projectDescription  This plugin is used to register and execute actions.
 * @author              Rob Gietema
 * @version             0.1
 *
 * @id jQuery.decoActionManager
 */
;(function($){

    // Global array containing actions and shortcuts
    $.decoActionManager = {
        actions: [],
        shortcuts: []
    };

    $.decoRegisterAction = function (name, options) {

        // Extend default settings
        options = $.extend({

            // Handler for executing the action
            exec: function (panel) {
            },

            // Shortcut can be any key + ctrl/shift/alt or a combination of those
            shortcut: {
                ctrl: false,
                alt: false,
                shift: false,
                key: ""
            },

            // Method to see if the actions should be visible based on the current tile state
            visible: function (tile) {
                return true;
            }
        }, options);

        // Add action to manager
        $.decoActionManager.actions[name] = options;

        // Check if shortcut is defined
        if (options.shortcut.key != "") {

            // Set keyCode and charCode
            options.shortcut.charCode = options.shortcut.key.toUpperCase().charCodeAt(0);
            options.shortcut.action = name;

            // Set shortcut
            $.decoActionManager.shortcuts.push(options.shortcut);
        }
    };

    $.fn.decoExecAction = function () {

        // Check if actions specified
        if ($(this).data("action") != "") {

            // Get toolbar object
            var obj = $(this).parents(".deco-toolbar");
            var options = obj.data("options");

            // Get panel
            var panel = $("#" + options['panel']);

            // Exec actions
            $.decoActionManager.actions[$(this).data("action")].exec(panel);
        }
    };

    // Init default actions
    $.decoInitDefaultActions = function () {
        $.decoRegisterAction('bold', {
            exec: function (panel) {
                tinyMCE.execCommand("Bold");
            },
            shortcut: {
                ctrl: true,
                alt: false,
                shift: false,
                key: 'b'
            }
        });

        $.decoRegisterAction('italic', {
            exec: function (panel) {
                tinyMCE.execCommand("Italic");
            }
        });

        $.decoRegisterAction('ul', {
            exec: function (panel) {
                tinyMCE.execCommand("InsertUnorderedList")
            }
        });

        $.decoRegisterAction('ol', {
            exec: function (panel) {
                tinyMCE.execCommand("InsertOrderedList")
            }
        });

        $.decoRegisterAction('undo', {
            exec: function (panel) {
                tinyMCE.execCommand("Undo")
            }
        });

        $.decoRegisterAction('redo', {
            exec: function (panel) {
                tinyMCE.execCommand("Redo")
            }
        });

        $.decoRegisterAction('paragraph', {
            exec: function (panel) {
                tinyMCE.execCommand("FormatBlock", false, "p");
                $.decoFixWebkitSpan();
            }
        });

        $.decoRegisterAction('heading', {
            exec: function (panel) {
                tinyMCE.execCommand("FormatBlock", false, "h2");
                $.decoFixWebkitSpan();
            }
        });

        $.decoRegisterAction('subheading', {
            exec: function (panel) {
                tinyMCE.execCommand("FormatBlock", false, "h3");
                $.decoFixWebkitSpan();
            }
        });

        $.decoRegisterAction('discreet', {
            exec: function (panel) {
                tinyMCE.execCommand("FormatBlock", false, "p");
                tinyMCE.execCommand("mceSetCSSClass", false, "discreet");
                $.decoFixWebkitSpan();
            }
        });

        $.decoRegisterAction('literal', {
            exec: function (panel) {
                tinyMCE.execCommand("FormatBlock", false, "pre");
                $.decoFixWebkitSpan();
            }
        });

        $.decoRegisterAction('quote', {
            exec: function (panel) {
                tinyMCE.execCommand("FormatBlock", false, "div");
                tinyMCE.execCommand("mceSetCSSClass", false, "pullquote");
                $.decoFixWebkitSpan();
            }
        });

        $.decoRegisterAction('callout', {
            exec: function (panel) {
                tinyMCE.execCommand("FormatBlock", false, "p");
                tinyMCE.execCommand("mceSetCSSClass", false, "callout");
                $.decoFixWebkitSpan();
            }
        });

        $.decoRegisterAction('highlight', {
            exec: function (panel) {
                tinyMCE.execCommand("mceSetCSSClass", false, "visualHighlight");
                $.decoFixWebkitSpan();
            }
        });

        $.decoRegisterAction('sub', {
            exec: function (panel) {
                tinyMCE.execCommand("Subscript");
                $.decoFixWebkitSpan();
            }
        });

        $.decoRegisterAction('sup', {
            exec: function (panel) {
                tinyMCE.execCommand("Superscript");
                $.decoFixWebkitSpan();
            }
        });

        $.decoRegisterAction('remove-style', {
            exec: function (panel) {
                tinyMCE.execCommand("RemoveFormat");
                $.decoFixWebkitSpan();
            }
        });

        $.decoRegisterAction('pagebreak', {
            exec: function (panel) {
                tinyMCE.execCommand("FormatBlock", false, "p");
                tinyMCE.execCommand("mceSetCSSClass", false, "pagebreak");
                $.decoFixWebkitSpan();
            }
        });

        $.decoRegisterAction('justify-left', {
            exec: function (panel) {
                tinyMCE.execCommand("mceSetCSSClass", false, "justify-left");
                $.decoFixWebkitSpan();
            }
        });

        $.decoRegisterAction('justify-center', {
            exec: function (panel) {
                tinyMCE.execCommand("mceSetCSSClass", false, "justify-center");
                $.decoFixWebkitSpan();
            }
        });

        $.decoRegisterAction('justify-right', {
            exec: function (panel) {
                tinyMCE.execCommand("mceSetCSSClass", false, "justify-right");
                $.decoFixWebkitSpan();
            }
        });

        $.decoRegisterAction('justify-justify', {
            exec: function (panel) {
                tinyMCE.execCommand("mceSetCSSClass", false, "justify-justify");
                $.decoFixWebkitSpan();
            }
        });

        $.decoRegisterAction('tile-align-block', {
            exec: function (panel) {

                // Remove left and right align classes
                panel.find(".deco-selected-tile").removeClass("deco-tile-align-right deco-tile-align-left");
            },
            shortcut: {
                ctrl: true,
                alt: false,
                shift: true,
                key: 'b'
            }
        });

        $.decoRegisterAction('tile-align-left', {
            exec: function (panel) {

                // Remove right align class, add left align class
                panel.find(".deco-selected-tile")
                    .removeClass("deco-tile-align-right")
                    .addClass("deco-tile-align-left");
            },
            shortcut: {
                ctrl: true,
                alt: false,
                shift: true,
                key: 'l'
            }
        });

        $.decoRegisterAction('tile-align-right', {
            exec: function (panel) {

                // Remove left align class, add right align class
                panel.find(".deco-selected-tile")
                    .removeClass("deco-tile-align-left")
                    .addClass("deco-tile-align-right");
            },
            shortcut: {
                ctrl: true,
                alt: false,
                shift: true,
                key: 'r'
            }
        });

        $.decoRegisterAction('save', {
            exec: function (panel) {
                $.decoNotify("info", "Info", "Changes saved");
            },
            shortcut: {
                ctrl: true,
                alt: false,
                shift: false,
                key: 's'
            }
        });

        $.decoRegisterAction('cancel', {
            exec: function (panel) {
                $.decoNotify("error", "Error", "Edit cancelled");
            },
            shortcut: {
                ctrl: true,
                alt: false,
                shift: true,
                key: 'a'
            }
        });
    };

    $(document).keypress(function (e) {

        // Action name
        var action = "";

        // Loop through shortcuts
        $($.decoActionManager.shortcuts).each(function () {

            // Check if shortcut matched
            if (((e.ctrlKey == this.ctrl) || (navigator.userAgent.toLowerCase().indexOf('macintosh') != -1 && e.metaKey == this.ctrl)) &&
                ((e.altKey == this.alt) || (e.altKey == undefined)) &&
                (e.shiftKey == this.shift) &&
                (e.charCode && String.fromCharCode(e.charCode).toUpperCase().charCodeAt(0) == this.charCode)) {

                // Found action
                action = this.action;
            }
        });

        // Check if shortcut found
        if (action != "") {

            // Get selected tile
            var selected_tile = $(".deco-selected-tile");

            // If selected tile
            if (selected_tile.length > 0) {

                // Exec actions
                $.decoActionManager.actions[action].exec(selected_tile.parents(".deco-layout"));

            // Else no tile selected
            } else {

                // Exec actions on all panels
                $.decoActionManager.actions[action].exec($(".deco-layout"));
            }

            // Prevent other actions
            return false;
        }

        // Normal exit
        return true;
    });
})(jQuery);