/**
 * jQuery.decoToolbar
 * 
 * @projectDescription  This plugin is used to create a deco toolbar.
 * @author              Rob Gietema
 * @version             0.1
 *
 * @id jQuery.decoToolbar
 * @id jQuery.fn.decoToolbar
 */
;(function($){

    /**
    * Create a new instance of a deco toolbar.
    *
    * @classDescription         This class creates a new deco toolbar.
    * @param {Object} options   This object contains the options used for the deco toolbar.
    * @return {Object}          Returns a new deco toolbar object.
    * @type {Object}
    * @constructor
    */
    $.fn.decoToolbar = function(options) {

        // Extend default settings
        options = $.extend({
        }, options);

        // Loop through matched elements
        return this.each(function() {

            // Get current object
            var obj = $(this);

            // Store options
            obj.data("options", options);

            // Add deco toolbar class
            obj.addClass("deco-toolbar deco-inline-toolbar");
            obj.html("");
            obj.append($(document.createElement("div"))
                .addClass("deco-toolbar-border")
                .append($(document.createElement("div"))
                    .addClass("deco-toolbar-border-left")
                )
                .append($(document.createElement("div"))
                    .addClass("deco-toolbar-border-content")
                )
                .append($(document.createElement("div"))
                    .addClass("deco-toolbar-border-right")
                )
            );
            obj.append($(document.createElement("div"))
                .addClass("deco-toolbar-content")
            );
            var content = obj.children(".deco-toolbar-content");

            // Add global actions to toolbar
            for (x in options.global_actions) {
                var action_group = options.global_actions[x];
                content.append($(document.createElement("span"))
                    .addClass("deco-toolbar-group deco-toolbar-group-" + x.replace(/_/g, "-"))
                    .attr("title", options.global_actions[x].label)
                );
                var elm_action_group = content.children(".deco-toolbar-group-" + x.replace(/_/g, "-"));
                for (y in action_group.actions) {
                    elm_action_group.append($(document.createElement("input"))
                        .addClass("deco-button deco-button-" + y.replace(/_/g, "-"))
                        .attr("title", action_group.actions[y].label)
                        .attr("type", "button")
                        .data("action", action_group.actions[y].action)
                        .mousedown(function () {
                            $(this).decoExecAction();
                        })
                    )
                }
            }

            // Add styles to toolbar
            for (x in options.styles) {
                var action_group = options.styles[x];
                content.append($(document.createElement("span"))
                    .addClass("deco-toolbar-group deco-toolbar-group-" + x.replace(/_/g, "-"))
                    .attr("title", options.styles[x].label)
                );
                var elm_action_group = content.children(".deco-toolbar-group-" + x.replace(/_/g, "-"));
                for (y in action_group.actions) {
                    if (action_group.actions[y].favorite) {
                        elm_action_group.append($(document.createElement("input"))
                            .addClass("deco-button deco-button-" + y.replace(/_/g, "-"))
                            .attr("title", action_group.actions[y].label)
                            .attr("type", "button")
                            .data("action", action_group.actions[y].action)
                            .mousedown(function () {
                                $(this).decoExecAction();
                            })
                        )
                    }
                }
                if (elm_action_group.children().length == 0) {
                    elm_action_group.remove();
                }
            }

            // Create the style menu
            content.prepend($(document.createElement("span"))
                .addClass("deco-toolbar-group deco-toolbar-group-style")
                .append($(document.createElement("select"))
                    .addClass("deco-style-menu")
                    .append($(document.createElement("option"))
                        .attr("value", "style")
                        .html("Style...")
                    )
                )
            );
            var elm_select_style = content.find(".deco-style-menu");
            for (x in options.styles) {
                var action_group = options.styles[x];
                elm_select_style.append($(document.createElement("optgroup"))
                    .addClass("deco-option-group deco-option-group-" + x.replace(/_/g, "-"))
                    .attr("label", options.styles[x].label)
                );
                var elm_action_group = content.find(".deco-option-group-" + x.replace(/_/g, "-"));
                for (y in action_group.actions) {
                    if (action_group.actions[y].favorite == false) {
                        elm_action_group.append($(document.createElement("option"))
                            .addClass("deco-option deco-option-" + y.replace(/_/g, "-"))
                            .attr("value", y)
                            .html(action_group.actions[y].label)
                            .data("action", action_group.actions[y].action)
                        );
                    }
                }
                if (elm_action_group.children().length == 0) {
                    elm_action_group.remove();
                }
            }

            // Create the insert menu
            content.prepend($(document.createElement("span"))
                .addClass("deco-toolbar-group deco-toolbar-group-insert")
                .append($(document.createElement("select"))
                    .addClass("deco-insert-menu")
                    .append($(document.createElement("option"))
                        .attr("value", "insert")
                        .html("Insert...")
                    )
                )
            );
            var elm_select_insert = content.find(".deco-insert-menu");
            for (x in options.tiles) {
                var action_group = options.tiles[x];
                elm_select_insert.append($(document.createElement("optgroup"))
                    .addClass("deco-option-group deco-option-group-" + x.replace(/_/g, "-"))
                    .attr("label", options.tiles[x].label)
                );
                var elm_action_group = content.find(".deco-option-group-" + x.replace(/_/g, "-"));
                for (y in action_group.tiles) {
                    elm_action_group.append($(document.createElement("option"))
                        .addClass("deco-option deco-option-" + y.replace(/_/g, "-"))
                        .attr("value", y)
                        .html(action_group.tiles[y].label)
                    );
                }
                if (elm_action_group.children().length == 0) {
                    elm_action_group.remove();
                }
            }

            // Get panel
            var panel = $("#" + options['panel']);

            // Insert new tile
             $(this).find(".deco-insert-menu").change(function(e) {

                // Check if value selected
                if ($(this).val() == "insert") {
                    return;
                }

                // Deselect tiles
                panel.find(".deco-selected-tile")
                    .removeClass("deco-selected-tile")
                    .children(".deco-tile-content").blur()

                // Set actions
                obj.decoToolbarSetActions("");

                // Set dragging state
                panel.addClass("deco-panel-dragging deco-panel-dragging-new");

                 // Get tile config
                var tile_config;
                for (x in options.tiles) {
                    var tile_group = options.tiles[x];
                    for (y in tile_group.tiles) {
                        if (y == $(this).val()) {
                           tile_config = tile_group.tiles[y];
                        }
                    }
                }

                // Add helper
                panel.append(
                    $(document.createElement("div"))
                        .addClass("deco-grid-row")
                        .append($(document.createElement("div"))
                            .addClass("deco-grid-cell deco-width-half deco-position-leftmost")
                            .append($(document.createElement("div"))
                                .addClass("movable removable deco-tile deco-" + $(this).val() + "-tile")
                                .append($(document.createElement("div"))
                                    .addClass("deco-tile-content")
                                    .html(tile_config.default_value)
                                )
                                .addClass("deco-helper-tile deco-helper-tile-new deco-original-tile")
                            )
                        )
                )

                // Set helper min size
                var helper = panel.find(".deco-helper-tile-new");
                if (helper.width() < panel.width() / 4) {
                    helper.width(panel.width() / 4);
                }
                helper.decoInitTile();

                // Notify user
                $.decoNotify("info", "Inserting new tile", "Select the location for the new tile");

                // Reset menu
                $(this).val("insert");
            });

            // Set style
             $(this).find(".deco-style-menu").change(function(e) {

                // Get selected item
                var selected_item = $(this).find("[value=" + $(this).val() + "]");

                // Execute the action
                selected_item.decoExecAction();

                // Reset menu
                $(this).val("style");
            });

            // Reposition toolbar on scroll
            $(window).scroll(function () {

                if (parseInt($(window).scrollTop()) > parseInt(obj.parent().offset().top)) {
                    if (obj.hasClass("deco-inline-toolbar")) {
                        var left = obj.offset().left;

                        // Fix bug in Firefox when margin auto is used
                        if ($.browser.mozilla && $(window).width() % 2 == 1)
                            left++;
                        obj
                            .width(obj.width())
                            .css({
                                'left': left,
                                'margin-left': '0px'
                            })
                            .removeClass("deco-inline-toolbar")
                            .addClass("deco-external-toolbar")
                            .parent().height(obj.height())
                    }
                } else {
                    if (obj.hasClass("deco-external-toolbar")) {
                        obj
                            .css({
                                'width': '',
                                'left': '',
                                'margin-left': ''
                            })
                            .removeClass("deco-external-toolbar")
                            .addClass("deco-inline-toolbar")
                            .parent().css('height','');
                    }
                }
            });

            // Set default actions
            $(this).decoToolbarSetActions("");
        });
    };

    $.fn.decoToolbarSetActions = function(tiletype) {

        // Loop through matched elements
        return this.each(function() {

            // Get object
            var obj = $(this);

            // Get options
            var options = obj.data("options");

            // Get actions
            var actions = options.default_available_actions;
            for (x in options.tiles) {
                var tile_group = options.tiles[x];
                for (y in tile_group.tiles) {
                    if (y == tiletype) {
                        actions = actions.concat(tile_group.tiles[y].available_actions);
                    }
                }
            }

            // Show all controls
            obj.find(".deco-style-menu").parent().show();
            obj.find(".deco-option-group").show();

            // Hide all actions
            obj.find(".deco-button").hide();
            obj.find(".deco-style-menu").find(".deco-option")
                .hide()
                .attr("disabled", "disabled");

            // Show actions
            $(actions).each(function () {
                obj.find(".deco-button-" + this).show();
                obj.find(".deco-option-" + this)
                    .show()
                    .attr("disabled", "");
            });

            // Hide option group if now visible items
            obj.find(".deco-option-group").each(function () {
                if ($(this).children(":enabled").length == 0) {
                    $(this).hide();
                }
            });

            // Hide menu if no enabled items
            if (obj.find(".deco-insert-menu").find(".deco-option:enabled").length == 0) {
                obj.find(".deco-insert-menu").parent().hide();
            }
            if (obj.find(".deco-style-menu").find(".deco-option:enabled").length == 0) {
                obj.find(".deco-style-menu").parent().hide();
            }

            // Set available fields
            var panel = $("#" + options.panel);
            obj.find(".deco-insert-menu").children(".deco-option-group-fields").children().each(function () {
                if (panel.find(".deco-" + $(this).attr("value") + "-tile").length == 0) {
                    $(this).show().attr("disabled", "");
                } else {
                    $(this).hide().attr("disabled", "disabled");
                }
            });

            // Set options group
            if (obj.find(".deco-insert-menu").children(".deco-option-group-fields").children(".deco-option:enabled").length == 0) {
                obj.find(".deco-insert-menu").children(".deco-option-group-fields").hide()
            } else {
                obj.find(".deco-insert-menu").children(".deco-option-group-fields").show()
            }
        });
    };
})(jQuery);

