/**
 * jQuery.decoLayout
 * 
 * @projectDescription  This plugin is used to create a deco layout.
 * @author              Rob Gietema
 * @version             0.1
 *
 * @id jQuery.decoLayout
 * @id jQuery.fn.decoLayout
 */
;(function($){

    // Global array containing width classes
    $.decoWidthClasses = ['deco-width-quarter', 'deco-width-third', 'deco-width-half', 'deco-width-two-thirds', 'deco-width-three-quarters', 'deco-width-full'];
    $.decoPositionClasses = ['deco-position-leftmost', 'deco-position-quarter', 'deco-position-third', 'deco-position-half', 'deco-position-two-thirds', 'deco-position-three-quarters'];

    /**
    * Create a new instance of a deco layout.
    *
    * @classDescription         This class creates a new deco layout.
    * @param {Object} options   This object contains the options used for the deco layout.
    * @return {Object}          Returns a new deco layout object.
    * @type {Object}
    * @constructor
    */
    $.fn.decoLayout = function(options) {

        // Extend default settings
        options = $.extend({
        }, options);

        // Loop through matched elements
        return this.each(function() {

            // Get current object
            var obj = $(this);

            // Store options
            obj.data("options", options);

            // Add deco layout class
            obj.addClass("deco-layout");

            // Add keydown handler
            $(document).keydown(function(e) {

                // Check if esc
                if (e.keyCode == 27) {

                    // Check if dragging
                    var original_tile = $(".deco-original-tile");
                    if (original_tile.length > 0) {
                        original_tile.each(function () {
                            $(this).addClass("deco-drag-cancel");
                            if ($(this).hasClass("deco-helper-tile-new")) {
                                $(document).trigger("mousedown");
                            } else {
                                $(document).trigger("mouseup");
                            }
                        });

                    // Deselect tile
                    } else {

                        // Deselect tiles
                        obj.find(".deco-selected-tile")
                            .removeClass("deco-selected-tile")
                            .children(".deco-tile-content").blur();

                        // Set actions
                        $("#" + options['toolbar']).decoToolbarSetActions("");
                        obj.decoSetResizeHandleLocation();
                    }

                    // Find resize helper
                    $(".deco-resize-handle-helper").each (function () {

                        // Remove resizing state
                        $(this).parents(".deco-layout").removeClass("deco-panel-resizing");
                        $(this).parent().removeClass("deco-row-resizing");
                        $(this).parent().children(".deco-resize-placeholder").remove();

                        // Remove helper
                        $(this).remove();
                    });
                }
            });

            // Add deselect
            $(document).mousedown(function(e) {

                // Get element
                var elm;
                if (e.target)
                    elm = e.target;
                else if (e.srcElement)
                    elm = e.srcElement;

                // If clicked outside a tile
                if ($(elm).parents(".deco-tile").length == 0) {

                    // Check if outside toolbar
                    if ($(elm).parents(".deco-toolbar").length == 0) {

                        // Deselect tiles
                        obj.find(".deco-selected-tile")
                            .removeClass("deco-selected-tile")
                            .children(".deco-tile-content").blur()

                        // Set actions
                        $("#" + options['toolbar']).decoToolbarSetActions("");
                        obj.decoSetResizeHandleLocation();
                    }
                }

                // Find resize helper
                var new_tile = $(".deco-helper-tile-new");
                if (new_tile.length > 0) {
                    new_tile.each (function () {

                        // Handle drag end
                        $(this).decoHandleDragEnd();
                    });
                }
            });

            $(document).mousemove(function(e) {

                // Handle mouse move event
                $(document).decoHandleMouseMove(e);
            });


            $(document).mouseup(function(e) {

                // Find resize helper
                $(".deco-resize-handle-helper").each (function () {

                    // Get panel
                    var panel = $(this).parents(".deco-layout");

                    // Get column sizes
                    var column_sizes = $(this).data("column_sizes").split(" ");

                    // Set column sizes
                    $(this).parent().children(".deco-grid-cell").each(function (i) {
                        var offset_x = 0;
                        for (var j = 0; j < i; j++) {
                            offset_x += parseInt(column_sizes[j]);
                        }
                        $(this)
                            .removeClass($.decoPositionClasses.join(" "))
                            .removeClass($.decoWidthClasses.join(" "))
                            .addClass($.decoGetPositionClassByInt(offset_x) + " " + $.decoGetWidthClassByInt(parseInt(column_sizes[i])));
                    });

                    // Remove resizing state
                    panel.removeClass("deco-panel-resizing");
                    $(this).parent().removeClass("deco-row-resizing");
                    $(this).parent().children(".deco-resize-placeholder").remove();

                    // Set resize handles
                    $(this).parent().decoSetResizeHandles();
                    panel.decoSetResizeHandleLocation();

                    // Remove helper
                    $(this).remove();
                });
            });

            // Add icons and dividers
            obj.find('.deco-tile').decoInitTile();
            obj.find(".deco-tile").decoAddDrag();
            obj.decoAddEmptyRows();
            obj.children(".deco-grid-row").decoSetResizeHandles();
        });
    };

    $.fn.decoHandleMouseMove = function (e) {

        // Find resize helper
        $(".deco-helper-tile-new").each (function () {

            // Get offset
            var offset = $(this).parent().offset();

            // Get mouse x
            $(this).css("top", e.pageY + 3 - offset.top);
            $(this).css("left", e.pageX + 3 - offset.left);
        });

        // Find resize helper
        $(".deco-resize-handle-helper").each (function () {

            // Get helper
            var helper = $(this);

            // Get row
            var row = helper.parent();

            // Get mouse x
            var mouse_x = parseFloat(e.pageX - row.offset().left - 4);

            // Get mouse percentage
            var mouse_percentage = (mouse_x / helper.data("row_width")) * 100;

            // Get closest snap location
            var snap = 25;
            var snap_offset = 1000;
            $([25, 33, 50, 67, 75]).each(function () {
                cur_snap_offset = Math.abs(this - mouse_percentage);
                if (cur_snap_offset < snap_offset) {
                    snap = this;
                    snap_offset = cur_snap_offset;
                }
            });

            // If 2 columns
            if (helper.data("nr_of_columns") == 2) {

                // Check if resize
                if (helper.data("column_sizes").split(" ")[0] != snap) {

                    // Loop through columns
                    row.children(".deco-resize-placeholder").each(function (i) {

                        // First column
                        if (i == 0) {

                            // Set new width and position
                            $(this)
                                .removeClass($.decoWidthClasses.join(" "))
                                .addClass($.decoGetWidthClassByInt(parseInt(snap)));

                        // Second column
                        } else {

                            // Set new width and position
                            $(this)
                                .removeClass($.decoPositionClasses.join(" ").replace(/position/g, "resize"))
                                .removeClass($.decoWidthClasses.join(" "))
                                .addClass($.decoGetWidthClassByInt(parseInt(100 - snap)))
                                .addClass($.decoGetPositionClassByInt(parseInt(snap)).replace("position", "resize"));

                            // Set helper
                            helper
                                .removeClass($.decoPositionClasses.join(" ").replace(/position/g, "resize"))
                                .addClass($.decoGetPositionClassByInt(parseInt(snap)).replace("position", "resize"));
                        }
                    });

                    // Set new size
                    $(this).data("column_sizes", snap + " " + (100 - snap));
                }

            // Else 3 columns
            } else {

                // Get resize handle index
                var resize_handle_index = $(this).data("resize_handle_index");

                // Check if first resize handle
                if (resize_handle_index == 1) {

                    // Check if resize
                    if ((helper.data("column_sizes").split(" ")[$(this).data("resize_handle_index") - 1] != snap) && (parseInt(snap) <= 50)) {

                        // Get columns
                        var columns = row.children(".deco-resize-placeholder");

                        // Remove position and width classes
                        columns
                            .removeClass($.decoPositionClasses.join(" ").replace(/position/g, "resize"))
                            .removeClass($.decoWidthClasses.join(" "))
                        helper
                            .removeClass($.decoPositionClasses.join(" ").replace(/position/g, "resize"))
                            .addClass($.decoGetPositionClassByInt(parseInt(snap)).replace("position", "resize"));

                        // Get layout
                        switch (parseInt(snap)) {
                            case 25:
                                $(columns.get(0)).addClass($.decoGetPositionClassByInt(0).replace("position", "resize") + " " + $.decoGetWidthClassByInt(25))
                                $(columns.get(1)).addClass($.decoGetPositionClassByInt(25).replace("position", "resize") + " " + $.decoGetWidthClassByInt(50))
                                $(columns.get(2)).addClass($.decoGetPositionClassByInt(75).replace("position", "resize") + " " + $.decoGetWidthClassByInt(25))
                                helper.data("column_sizes", "25 50 25");
                                break;
                            case 33:
                                $(columns.get(0)).addClass($.decoGetPositionClassByInt(0).replace("position", "resize") + " " + $.decoGetWidthClassByInt(33))
                                $(columns.get(1)).addClass($.decoGetPositionClassByInt(33).replace("position", "resize") + " " + $.decoGetWidthClassByInt(33))
                                $(columns.get(2)).addClass($.decoGetPositionClassByInt(66).replace("position", "resize") + " " + $.decoGetWidthClassByInt(33))
                                helper.data("column_sizes", "33 33 33");
                                break;
                            case 50:
                                $(columns.get(0)).addClass($.decoGetPositionClassByInt(0).replace("position", "resize") + " " + $.decoGetWidthClassByInt(50))
                                $(columns.get(1)).addClass($.decoGetPositionClassByInt(50).replace("position", "resize") + " " + $.decoGetWidthClassByInt(25))
                                $(columns.get(2)).addClass($.decoGetPositionClassByInt(75).replace("position", "resize") + " " + $.decoGetWidthClassByInt(25))
                                helper.data("column_sizes", "50 25 25");
                                break;
                        }
                    }

                // Else second resize handle
                } else {

                    // Check if resize
                    if ((helper.data("column_sizes").split(" ")[$(this).data("resize_handle_index")] != (100 - snap)) && (parseInt(snap) >= 50)) {

                        // Get columns
                        var columns = row.children(".deco-resize-placeholder");

                        // Remove position and width classes
                        columns
                            .removeClass($.decoPositionClasses.join(" ").replace(/position/g, "resize"))
                            .removeClass($.decoWidthClasses.join(" "))
                        helper
                            .removeClass($.decoPositionClasses.join(" ").replace(/position/g, "resize"))
                            .addClass($.decoGetPositionClassByInt(parseInt(snap)).replace("position", "resize"));

                        // Get layout
                        switch (parseInt(snap)) {
                            case 50:
                                $(columns.get(0)).addClass($.decoGetPositionClassByInt(0).replace("position", "resize") + " " + $.decoGetWidthClassByInt(25))
                                $(columns.get(1)).addClass($.decoGetPositionClassByInt(25).replace("position", "resize") + " " + $.decoGetWidthClassByInt(25))
                                $(columns.get(2)).addClass($.decoGetPositionClassByInt(50).replace("position", "resize") + " " + $.decoGetWidthClassByInt(50))
                                helper.data("column_sizes", "25 25 50");
                                break;
                            case 66:
                            case 67:
                                $(columns.get(0)).addClass($.decoGetPositionClassByInt(0).replace("position", "resize") + " " + $.decoGetWidthClassByInt(33))
                                $(columns.get(1)).addClass($.decoGetPositionClassByInt(33).replace("position", "resize") + " " + $.decoGetWidthClassByInt(33))
                                $(columns.get(2)).addClass($.decoGetPositionClassByInt(66).replace("position", "resize") + " " + $.decoGetWidthClassByInt(33))
                                helper.data("column_sizes", "33 33 33");
                                break;
                            case 75:
                                $(columns.get(0)).addClass($.decoGetPositionClassByInt(0).replace("position", "resize") + " " + $.decoGetWidthClassByInt(25))
                                $(columns.get(1)).addClass($.decoGetPositionClassByInt(25).replace("position", "resize") + " " + $.decoGetWidthClassByInt(50))
                                $(columns.get(2)).addClass($.decoGetPositionClassByInt(75).replace("position", "resize") + " " + $.decoGetWidthClassByInt(25))
                                helper.data("column_sizes", "25 50 25");
                                break;
                        }
                    }
                }
            }
        });
    };

    $.fn.decoInitTile = function () {

        // Loop through matched elements
        return this.each(function() {

            // Get layout object
            var tile = $(this);
            var obj = tile.parents(".deco-layout");
            var options = obj.data("options");

            // Get tile type
            var tiletype = $(this).decoGetTileType();

            // Get tile config
            var tile_config;
            for (x in options.tiles) {
                var tile_group = options.tiles[x];
                for (y in tile_group.tiles) {
                    if (y == tiletype) {
                       tile_config = tile_group.tiles[y];
                    }
                }
            }

            // Check read only
            if (tile_config.read_only) {

                // Set read only
                $(this).addClass("deco-read-only-tile");
            }

            // Init rich text
            if (tile_config.rich_text && (tile_config.type != 'field' || tile_config.read_only == false)) {

                // Replace inputs
                $(this).find("input").each(function () {
                    $(this).after($(this).attr("value"));
                    $(this).remove();
                });

                // Replace textareas
                $(this).find("textarea").each(function () {

                    // Get html
                    var html = $(this).html();

                    // Look for entities to decode
                    if (/&[^;]+;/.test(html)) {

                        // Decode the entities using a div element
                        var elm = document.createElement("div");
                        elm.innerHTML = $(this).html();
                        $(this).after(!elm.firstChild ? $(this).html() : elm.firstChild.nodeValue);

                    // No entities to be decoded
                    } else {

                        // Set original html
                        $(this).after(html);
                    }

                    // Remove textarea
                    $(this).remove();
                });

                // Generate random id
                var random_id = 1 + Math.floor(100000 * Math.random());
                while ($("#deco-rich-text-init-" + random_id).length > 0) {
                    random_id = 1 + Math.floor(100000 * Math.random());
                }
                $(this).children('.deco-tile-content').attr('id', 'deco-rich-text-init-' + random_id);

                // Init rich editor
                tinyMCE.init({
                    mode : "exact",
                    elements : "deco-rich-text-init-" + random_id,
                    content_editable : true,
                    theme : "plone"
                });
            }

            $(this).prepend(
                $(document.createElement("div"))
                    .addClass("deco-tile-outer-border")
                    .append(
                        $(document.createElement("div"))
                            .addClass("deco-tile-inner-border")
                    )
            );

            if (tile_config.type == "field") {
                $(this).prepend(
                    $(document.createElement("div"))
                        .addClass("deco-tile-control deco-field-label")
                        .append(
                            $(document.createElement("div"))
                                .addClass("deco-field-label-content")
                                .html(tile_config.label)
                        )
                        .append(
                            $(document.createElement("div"))
                                .addClass("deco-field-label-left")
                        )
                )
            }

            if ($(this).hasClass("movable")) {
                $(this).prepend(
                    $(document.createElement("div"))
                        .addClass("deco-tile-control deco-drag-handle")
                );
            }
            if ($(this).hasClass("removable")) {
                $(this).prepend(
                    $(document.createElement("div"))
                        .addClass("deco-tile-control deco-close-icon")
                        .click(function () {
                            // Remove empty rows
                            obj.decoRemoveEmptyRows();

                            // Get original row
                            var original_row = $(this).parents(".deco-tile").parent().parent();

                            // Remove current tile
                            $(this).parent().remove();

                            // Cleanup original row
                            original_row.decoCleanupRow();

                            // Add empty rows
                            obj.decoAddEmptyRows();

                            // Set toolbar
                            $("#" + options['toolbar']).decoToolbarSetActions("");
                            obj.decoSetResizeHandleLocation();
                        })
                );
            }
            $(this).prepend(
                $(document.createElement("div"))
                    .addClass("deco-tile-control deco-info-icon")
                    .click(function () {
                        $("#info-dialog")
                            .show()
                            .dialog({
                                autoopen: false,
                                height: '300',
                                modal: true,
                                overlay: {
                                    backgroundColor: '#000',
                                    opacity: 0.5
                                },
                                buttons: {
                                    'Ok': function() {
                                        $(this).dialog('destroy');
                                    },
                                    Cancel: function() {
                                        $(this).dialog('destroy');
                                    }
                                }
                            });
                    })
            );

            $(this).mousemove(function (e) {

                // Check if dragging
                if ($(this).parents(".deco-layout").hasClass("deco-panel-dragging")) {

                    // Hide all dividers
                    $(this).parents(".deco-layout").find(".deco-selected-divider").removeClass("deco-selected-divider");

                    // Don't show dividers if above original or floating tile
                    if (($(this).hasClass("deco-original-tile") == false) &&
                        ($(this).hasClass("deco-tile-align-left") == false) &&
                        ($(this).hasClass("deco-tile-align-right") == false)) {

                        // Get direction
                        var dir = $(this).decoGetDirection(e);
                        var divider = $(this).children(".deco-divider-" + dir);

                        // Check if left or right divider
                        if ((dir == "left") || (dir == "right")) {
                            var row = divider.parent().parent().parent();

                            // If row has multiple columns
                            if (row.children(".deco-grid-cell").length > 1) {
                                divider.height(row.height() - 4);
                                divider.css('top', (row.offset().top - divider.parent().offset().top));
                            } else {
                                divider.height(divider.parent().height() - 4);
                                divider.css('top', 0);
                            }
                        }

                        // Show divider
                        divider.addClass("deco-selected-divider");
                    }
                }
            });

            $(this).click(function () {

                // Select tile
                $(this).decoSelectTile();
            });

            $(this).prepend(
                $(document.createElement("div"))
                    .addClass("deco-divider deco-divider-top")
            );
            $(this).prepend(
                $(document.createElement("div"))
                    .addClass("deco-divider deco-divider-bottom")
            );
            $(this).prepend(
                $(document.createElement("div"))
                    .addClass("deco-divider deco-divider-right")
            );
            $(this).prepend(
                $(document.createElement("div"))
                    .addClass("deco-divider deco-divider-left")
            );
            $(this).prepend(
                $(document.createElement("div"))
                    .addClass("deco-divider-add deco-divider-add-top")
                    .attr("title", "Add text tile above")
            );
            $(this).prepend(
                $(document.createElement("div"))
                    .addClass("deco-divider-add deco-divider-add-bottom")
                    .attr("title", "Add text tile below")
            );
            $(this).children(".deco-divider-add").click(function () {

                // Get tile config
                var tile_config;
                for (x in options.tiles) {
                    var tile_group = options.tiles[x];
                    for (y in tile_group.tiles) {
                        if (y == "text") {
                           tile_config = tile_group.tiles[y];
                        }
                    }
                }

                if ($(this).hasClass("deco-divider-add-top")) {
                    tile.before($(document.createElement("div"))
                        .addClass("movable removable deco-tile deco-text-tile deco-new-tile")
                        .append($(document.createElement("div"))
                            .addClass("deco-tile-content")
                            .html(tile_config.default_value)
                        )
                    )
                } else {
                    tile.after($(document.createElement("div"))
                        .addClass("movable removable deco-tile deco-text-tile deco-new-tile")
                        .append($(document.createElement("div"))
                            .addClass("deco-tile-content")
                            .html(tile_config.default_value)
                        )
                    )
                }

                // Init and select the new tile
                var new_tile = obj.find(".deco-new-tile");
                new_tile.decoAddDrag()
                new_tile.decoInitTile();
                new_tile.decoSelectTile();
                new_tile.removeClass("deco-new-tile")

                // Prevent selection of current tile
                return false;
            });
        });
    };

    $.fn.decoGetTileType = function () {

        // Get tile type
        var tiletype = '';
        var classes = $(this).attr('class').split(" ");
        $(classes).each(function () {
            var classname = this.match(/^deco-(.*)-tile$/);
            if (classname != null) {
                if ((classname[1] != 'selected') && (classname[1] != 'new') && (classname[1] != 'read-only') && (classname[1] != 'helper') && (classname[1] != 'original')) {
                    tiletype = classname[1];
                }
            }
        });
        return tiletype;
    };

    $.fn.decoSelectTile = function () {

        // Loop through matched elements
        return this.each(function() {

            // Check if not already selected
            if ($(this).hasClass("deco-selected-tile") == false) {

                // Get layout object
                var obj = $(this).parents(".deco-layout");
                var options = obj.data("options");
 
                $(".deco-selected-tile").removeClass("deco-selected-tile").children(".deco-tile-content").blur();
                var options = obj.data("options");
                $(this).addClass("deco-selected-tile");

                // Get tile type
                var tiletype = $(this).decoGetTileType();

                // Set actions
                $("#" + options['toolbar']).decoToolbarSetActions(tiletype);
                obj.decoSetResizeHandleLocation();

                // Get content
                var tile_content = $(this).children(".deco-tile-content");
                tile_content.focus();
                var id = tile_content.attr("id");
                if (id !== null && id.indexOf('deco-rich-text-init') != -1) {

                    // Get editor
                    var ed = tinyMCE.get(tile_content.attr("id"));

                    // Append selection div to end of last block element
                    tile_content.children(":last").append($(document.createElement("span"))
                        .addClass("deco-tile-selection-end")
                        .html("&nbsp;")
                    );

                    // Select node and delete the selection
                    ed.execCommand("mceSelectNode", false, tile_content.find(".deco-tile-selection-end").get(0));
                    ed.execCommand("Delete");
                }
            }
        });
    };

    $.fn.decoAddMouseMoveEmptyRow = function () {

        // Loop through matched elements
        return this.each(function() {

            // Mouse move event
            $(this).mousemove(function (e) {

                // Get layout object
                var obj = $(this).parents(".deco-layout");

                // Check if dragging
                if (obj.hasClass("deco-panel-dragging")) {

                    // Hide all dividers
                    obj.find(".deco-selected-divider").removeClass("deco-selected-divider");
                    $(this).children("div").addClass("deco-selected-divider");
                }
            });
        });
    };

    $.fn.decoRemoveEmptyRows = function () {

        // Loop through matched elements
        return this.each(function() {

            // Remove all empty rows
            $(this).find(".deco-empty-row").remove();
        });
    };

    $.fn.decoAddEmptyRows = function() {

        // Loop through matched elements
        return this.each(function() {

            // Loop through rows
            $(this).find(".deco-grid-row").each(function (i) {

                // Check if current row has multiple columns
                if ($(this).children(".deco-grid-cell").length > 1) {

                    // Check if first row
                    if (i == 0) {
                        $(this).before(
                            $(document.createElement("div"))
                                .addClass("deco-grid-row deco-empty-row")
                                .append($(document.createElement("div"))
                                    .addClass("deco-grid-cell deco-width-full deco-position-leftmost")
                                    .append($(document.createElement("div"))
                                        .append($(document.createElement("div"))
                                            .addClass("deco-tile-outer-border")
                                        )
                                    )
                                )
                                .decoAddMouseMoveEmptyRow()
                        );
                    }

                    // Check if last row or next row also contains columns
                    if (($(this).nextAll(".deco-grid-row").length == 0) || ($(this).next().children(".deco-grid-cell").length > 1)) {
                        $(this).after(
                            $(document.createElement("div"))
                                .addClass("deco-grid-row deco-empty-row")
                                .append($(document.createElement("div"))
                                    .addClass("deco-grid-cell deco-width-full deco-position-leftmost")
                                    .append($(document.createElement("div"))
                                        .append($(document.createElement("div"))
                                            .addClass("deco-tile-outer-border")
                                        )
                                    )
                                )
                                .decoAddMouseMoveEmptyRow()
                        );
                    }
                }
            });
        });
    };

    $.fn.decoGetWidthClass = function() {

        // Loop through width classes
        for (x in $.decoWidthClasses) {

            // If class found
            if ($(this).hasClass($.decoWidthClasses[x])) {

                // Return the width class
                return $.decoWidthClasses[x];
            }
        }

        // Loop through width classes
        for (x in $.decoWidthClasses) {

            // If class found
            if ($(this).hasClass($.decoWidthClasses[x].replace("position", "resize"))) {

                // Return the width class
                return $.decoWidthClasses[x];
            }
        }

        // Fallback
        return $.decoWidthClasses[0];
    };

    $.fn.decoGetPositionClass = function() {

        // Loop through position classes
        for (x in $.decoPositionClasses) {

            // If class found
            if ($(this).hasClass($.decoPositionClasses[x])) {

                // Return the position class
                return $.decoPositionClasses[x];
            }
        }

        for (x in $.decoPositionClasses) {

            // If class found
            if ($(this).hasClass($.decoPositionClasses[x].replace("position", "resize"))) {

                // Return the position class
                return $.decoPositionClasses[x];
            }
        }

        // Fallback
        return $.decoPositionClasses[0];
    };

    $.fn.decoAddDrag = function() {

        // Loop through matched elements
        return this.each(function() {

            $(this).draggable({
                helper: 'clone',
                handle: 'div.deco-drag-handle',
                cursor: 'move',
                cursorAt: {top: -1},
                opacity: 0.5,
                scroll: true,
                appendTo: ".deco-layout",
                start: function(e,ui) {

                    // Get layout object
                    var obj = $(this).parents(".deco-layout");
                    var options = obj.data("options");

                    // Add dragging class to content area
                    obj.addClass("deco-panel-dragging");
                    $(this).addClass("deco-original-tile");
                    ui.helper.addClass("deco-helper-tile " + $(this).parent().decoGetWidthClass());
                    obj.find(".deco-selected-tile").removeClass("deco-selected-tile").children(".deco-tile-content").blur();
                },
                stop: function(e,ui) {

                    // Handle drag end
                    $(this).decoHandleDragEnd();
                }
            });
        });
    };

    $.fn.decoHandleDragEnd = function() {

        // Get layout object
        var obj = $(this).parents(".deco-layout");

        // Remove dragging class from content
        obj.removeClass("deco-panel-dragging deco-panel-dragging-new");

        var divider = obj.find(".deco-selected-divider");
        var drop = divider.parent();
        var dir = "";
        if (divider.hasClass("deco-divider-top"))
            dir = "top";
        if (divider.hasClass("deco-divider-bottom"))
            dir = "bottom";
        if (divider.hasClass("deco-divider-left"))
            dir = "left";
        if (divider.hasClass("deco-divider-right"))
            dir = "right";
        divider.removeClass("deco-selected-divider");

        // True if new tile is inserted
        var new_tile = obj.find(".deco-helper-tile-new").length > 0;
        var original_tile = obj.find(".deco-original-tile");

        // Check if esc is pressed
        if (original_tile.hasClass("deco-drag-cancel")) {

            // Remove cancel class
            original_tile.removeClass("deco-drag-cancel");

            // Remove remaining empty rows
            obj.decoRemoveEmptyRows();

            // Check if new tile
            if (!new_tile) {

                // Make sure the original tile doesn't get removed
                original_tile
                    .removeClass("deco-original-tile")
                    .addClass("deco-new-tile")
            }

        // Dropped on empty row
        } else if (drop.hasClass("deco-empty-row")) {

            // Replace empty with normal row class
            drop
                .removeClass("deco-empty-row")
                .unbind('mousemove')

            // Clean cell
            drop.children(".deco-grid-cell")
                .children("div").remove()

            // Add tile to empty row
            drop.children(".deco-grid-cell")
                .append(obj.find(".deco-original-tile")
                    .clone(true)
                    .removeClass("deco-original-tile deco-helper-tile deco-helper-tile-new deco-tile-align-right deco-tile-align-left")
                    .css({
                        width: "",
                        left: "",
                        top: ""
                    })
                    .decoAddDrag()
                    .addClass("deco-new-tile")
            );

            // Remove remaining empty rows
            obj.decoRemoveEmptyRows();

        // Not dropped on tile
        } else if (drop.hasClass("deco-tile") == false) {

            // Remove remaining empty rows
            obj.decoRemoveEmptyRows();

            // Check if new tile
            if (!new_tile) {

                // Make sure the original tile doesn't get removed
                obj.find(".deco-original-tile")
                    .removeClass("deco-original-tile")
                    .addClass("deco-new-tile")
            }

        // Check if max columns rows is reached
        } else if ((drop.parent().parent().children(".deco-grid-cell").length == 4) && (dir == "left" || dir == "right")) {

            // Remove remaining empty rows
            obj.decoRemoveEmptyRows();

            // Check if new tile
            if (!new_tile) {

                // Make sure the original tile doesn't get removed
                obj.find(".deco-original-tile")
                    .removeClass("deco-original-tile")
                    .addClass("deco-new-tile")
            }

            // Notify user
            $.decoNotify("info", "Info", "You can't have more then 4 columns");

        // Dropped on row
        } else {

            // Remove empty rows
            obj.decoRemoveEmptyRows();

            // If top
            if (dir == "top") {

                drop.before(
                    obj.find(".deco-original-tile")
                        .clone(true)
                        .removeClass("deco-original-tile deco-helper-tile deco-helper-tile-new deco-tile-align-right deco-tile-align-left")
                        .css({
                            width: "",
                            left: "",
                            top: ""
                        })
                        .decoAddDrag()
                        .addClass("deco-new-tile")
                );

            // If bottom
            } else if (dir == "bottom") {

                drop.after(
                    obj.find(".deco-original-tile")
                        .clone(true)
                        .removeClass("deco-original-tile deco-helper-tile deco-helper-tile-new deco-tile-align-right deco-tile-align-left")
                        .css({
                            width: "",
                            left: "",
                            top: ""
                        })
                        .decoAddDrag()
                        .addClass("deco-new-tile")
                );

            // If left
            } else if ((dir == "left") || (dir == "right")) {

                // Check if only 1 column in the row
                if (drop.parent().parent().children(".deco-grid-cell").length == 1) {

                    // Put tiles above dropped tile in a new row above
                    var prev_elms = drop.prevAll();
                    if (prev_elms.length > 0) {
                        drop.parent().parent()
                            .before($(document.createElement("div"))
                                .addClass("deco-grid-row")
                                .append($(document.createElement("div"))
                                    .addClass("deco-grid-cell deco-width-full deco-position-leftmost")
                                    .append($(prev_elms.get().reverse()).clone(true).decoAddDrag())
                                )
                            );
                        prev_elms.remove();
                    }

                    // Put tiles below dropped tile in a new row below
                    var next_elms = drop.nextAll();
                    if (next_elms.length > 0) {
                        drop.parent().parent()
                            .after($(document.createElement("div"))
                                .addClass("deco-grid-row")
                                .append($(document.createElement("div"))
                                    .addClass("deco-grid-cell deco-width-full deco-position-leftmost")
                                    .append(next_elms.clone(true).decoAddDrag())
                                )
                            );
                        next_elms.remove();
                    }

                    // Resize current column
                    drop.parent()
                        .removeClass($.decoWidthClasses.join(" "))
                        .removeClass($.decoPositionClasses.join(" "))
                        .addClass("deco-width-half");

                    // Create column with dragged tile in it
                    if (dir == "left") {
                        drop.parent()
                            .addClass("deco-position-half")
                            .before($(document.createElement("div"))
                                .addClass("deco-grid-cell deco-width-half deco-position-leftmost")
                                .append(
                                    obj.find(".deco-original-tile")
                                        .clone(true)
                                        .removeClass("deco-original-tile deco-helper-tile deco-helper-tile-new deco-tile-align-right deco-tile-align-left")
                                        .css({
                                            width: "",
                                            left: "",
                                            top: ""
                                        })
                                        .decoAddDrag()
                                        .addClass("deco-new-tile")
                                )
                        );
                    } else {
                        drop.parent()
                            .addClass("deco-position-leftmost")
                            .after($(document.createElement("div"))
                                .addClass("deco-grid-cell deco-width-half deco-position-half")
                                .append(
                                    obj.find(".deco-original-tile")
                                        .clone(true)
                                        .removeClass("deco-original-tile deco-helper-tile deco-helper-tile-new deco-tile-align-right deco-tile-align-left")
                                        .css({
                                            width: "",
                                            left: "",
                                            top: ""
                                        })
                                        .decoAddDrag() 
                                        .addClass("deco-new-tile")
                                )
                        );
                    }

                    // Add resize handles
                    drop.parent().parent().decoSetResizeHandles();

                // Dropped inside column
                } else {

                    // Create new column
                    if (dir == "left") {
                        drop.parent()
                            .before($(document.createElement("div"))
                                .addClass("deco-grid-cell")
                                .append(
                                    obj.find(".deco-original-tile")
                                        .clone(true)
                                        .removeClass("deco-original-tile deco-helper-tile deco-helper-tile-new deco-tile-align-right deco-tile-align-left")
                                        .css({
                                            width: "",
                                            left: "",
                                            top: ""
                                        })
                                        .decoAddDrag()
                                        .addClass("deco-new-tile")
                                    )
                            )
                    } else {
                        drop.parent()
                            .after($(document.createElement("div"))
                                .addClass("deco-grid-cell")
                                .append(
                                    obj.find(".deco-original-tile")
                                        .clone(true)
                                        .removeClass("deco-original-tile deco-helper-tile deco-helper-tile-new deco-tile-align-right deco-tile-align-left")
                                        .css({
                                            width: "",
                                            left: "",
                                            top: ""
                                        })
                                        .decoAddDrag()
                                        .addClass("deco-new-tile")
                                    )
                            )
                    }

                    // Rezize columns
                    drop.parent().parent().decoSetColumnSizes();

                    // Add resize handles
                    drop.parent().parent().decoSetResizeHandles();
                }
            }
        }

        var original_row = obj.find(".deco-original-tile").parent().parent();
        obj.find(".deco-original-tile").remove();

        // Cleanup original row
        original_row.decoCleanupRow();

        // Add empty rows
        obj.decoAddEmptyRows();

        // Select new tile
        if ((obj.hasClass("implicit") == false) || (new_tile)) {
            obj.find(".deco-new-tile").removeClass("deco-new-tile").decoSelectTile();
        } else {
            obj.find(".deco-new-tile").removeClass("deco-new-tile");
        }
    };

    $.fn.decoSetColumnSizes = function() {

        // Loop through matched elements
        return this.each(function() {

            // Resize columns in the row
            var nr_of_columns = $(this).children(".deco-grid-cell").length;
            $(this)
                .children(".deco-grid-cell").each(function (i) {
                    $(this)
                        .removeClass($.decoWidthClasses.join(" "))
                        .removeClass($.decoPositionClasses.join(" "))

                    // Set width / position
                    switch (nr_of_columns) {
                        case 1:
                            $(this).addClass("deco-width-full deco-position-leftmost");
                            break;
                        case 2:
                            switch (i) {
                                case 0:
                                    $(this).addClass("deco-width-half deco-position-leftmost");
                                    break;
                                case 1:
                                    $(this).addClass("deco-width-half deco-position-half");
                                    break;
                            }
                            break;
                        case 3:
                            switch (i) {
                                case 0:
                                    $(this).addClass("deco-width-third deco-position-leftmost");
                                    break;
                                case 1:
                                    $(this).addClass("deco-width-third deco-position-third");
                                    break;
                                case 2:
                                    $(this).addClass("deco-width-third deco-position-two-thirds");
                                    break;
                            }
                            break;
                        case 4:
                            switch (i) {
                                case 0:
                                    $(this).addClass("deco-width-quarter deco-position-leftmost");
                                    break;
                                case 1:
                                    $(this).addClass("deco-width-quarter deco-position-quarter");
                                    break;
                                case 2:
                                    $(this).addClass("deco-width-quarter deco-position-half");
                                    break;
                                case 3:
                                    $(this).addClass("deco-width-quarter deco-position-three-quarters");
                                    break;
                            }
                            break;
                    };
                })
        });
    };

    $.fn.decoSetResizeHandles = function () {

        // Loop through matched elements
        return this.each(function() {

            // Remove resize handles
            $(this).children(".deco-resize-handle").remove();

            // Check number of columns
            var nr_of_columns = $(this).children(".deco-grid-cell").length;
            switch (nr_of_columns) {
                case 2:
                    $(this).append($(document.createElement("div"))
                        .addClass("deco-resize-handle deco-resize-handle-center deco-resize-handle-one " + $($(this).children(".deco-grid-cell").get(1))
                            .decoGetPositionClass().replace("position", "resize")
                        )
                    )
                    break;
                case 3:
                    $(this).append($(document.createElement("div"))
                        .addClass("deco-resize-handle deco-resize-handle-center deco-resize-handle-one " + $($(this).children(".deco-grid-cell").get(1))
                            .decoGetPositionClass().replace("position", "resize")
                        )
                    )
                    $(this).append($(document.createElement("div"))
                        .addClass("deco-resize-handle deco-resize-handle-center deco-resize-handle-two " + $($(this).children(".deco-grid-cell").get(2))
                            .decoGetPositionClass().replace("position", "resize")
                        )
                    )
                    break;
            }

            $(this).children(".deco-resize-handle").mousedown(function (e) {

                // Get number of columns and current sizes
                var column_sizes = new Array();
                $(this).parent().children(".deco-grid-cell").each(function () {

                    // Add column size
                    switch ($(this).decoGetWidthClass()) {
                        case "deco-width-half":
                            column_sizes.push("50");
                            break;
                        case "deco-width-quarter":
                            column_sizes.push("25");
                            break;
                        case "deco-width-third":
                            column_sizes.push("33");
                            break;
                        case "deco-width-two-thirds":
                            column_sizes.push("66");
                            break;
                        case "deco-width-three-quarters":
                            column_sizes.push("75");
                            break;
                    }

                    // Add placeholder
                    $(this).parent().append($(document.createElement("div"))
                        .addClass("deco-resize-placeholder " + $(this).decoGetWidthClass() + " " + $(this).decoGetPositionClass().replace("position", "resize"))
                        .append($(document.createElement("div"))
                            .addClass("deco-resize-placeholder-inner-border")
                        )
                    )
                });
                var resize_handle_index = 1;
                if ($(this).hasClass("deco-resize-handle-two")) {
                    resize_handle_index = 2;
                }

                // Add helper
                $(this).parent().append($(document.createElement("div"))
                    .addClass("deco-resize-handle deco-resize-handle-helper")
                    .addClass($(this).decoGetPositionClass().replace("position", "resize"))
                    .data("row_width", $(this).parent().width())
                    .data("nr_of_columns", $(this).parent().children(".deco-grid-cell").length)
                    .data("column_sizes", column_sizes.join(" "))
                    .data("resize_handle_index", resize_handle_index)
                )

                // Set resizing state
                $(this).parents(".deco-layout").addClass("deco-panel-resizing");
                $(this).parent().addClass("deco-row-resizing");

                // Prevent drag event
                return false;
            });
        });
    };

    $.fn.decoCleanupRow = function() {

        // Loop through matched elements
        return this.each(function() {

            // Get original row
            var original_row = $(this);

            // Remove empty columns
            original_row.children(".deco-grid-cell").each(function () {
                if ($(this).children().length == 0) {
                    $(this).remove();

                    // Resize columns
                    original_row.decoSetColumnSizes();
                }
            });

            // Remove row if no tiles inside
            if (original_row.find(".deco-tile").length == 0) {
                var del_row = original_row;

                // Check if next row available
                if (original_row.nextAll(".deco-grid-row").length > 0) {
                    original_row = original_row.next(".deco-grid-row");

                // Check if prev row available
                } else if (original_row.prevAll(".deco-grid-row").length > 0) {
                    original_row = original_row.prev(".deco-grid-row");

                // This is the last row
                } else {
                    original_row.remove();
                    return;
                }

                // Remove current row
                del_row.remove();
            }

            // Check if prev row exists and if both rows only have 1 column
            if ((original_row.prevAll(".deco-grid-row").length > 0) && (original_row.children(".deco-grid-cell").length == 1) && (original_row.prev().children(".deco-grid-cell").length == 1)) {

                // Merge rows
                original_row.children(".deco-grid-cell").prepend(
                    original_row.prev().children(".deco-grid-cell").children(".deco-tile")
                        .clone(true)
                        .decoAddDrag()
                )
                original_row.prev().remove();
            }

            // Check if next row exists and if both rows only have 1 column
            if ((original_row.nextAll(".deco-grid-row").length > 0) && (original_row.children(".deco-grid-cell").length == 1) && (original_row.next().children(".deco-grid-cell").length == 1)) {

                // Merge rows
                original_row.children(".deco-grid-cell").append(
                    original_row.next().children(".deco-grid-cell").children(".deco-tile")
                        .clone(true)
                        .decoAddDrag()
                )
                original_row.next().remove();
            }

            // Set resize handles
            original_row.decoSetResizeHandles();
        });
    };

    $.fn.decoSetResizeHandleLocation = function () {

        // Get panel
        var obj = $(this);

        // Loop through rows
        obj.children(".deco-grid-row").each(function () {

            // Get row
            var row = $(this);

            // Get cells
            var cells = row.children(".deco-grid-cell")

            // Check if 2 or 3 columns
            if ((cells.length == 2) || (cells.length == 3)) {

                // Remove location classes
                row.children(".deco-resize-handle").removeClass("deco-resize-handle-left deco-resize-handle-center deco-resize-handle-right");

                // Check if first column is selected
                if ($(cells.get(0)).children(".deco-tile").hasClass("deco-selected-tile")) {

                    // Set location
                    row.children(".deco-resize-handle-one").addClass("deco-resize-handle-left");
                    row.children(".deco-resize-handle-two").addClass("deco-resize-handle-center");

                // Check if second columns is selected
                } else if ($(cells.get(1)).children(".deco-tile").hasClass("deco-selected-tile")) {

                    // Set location
                    row.children(".deco-resize-handle-one").addClass("deco-resize-handle-right");
                    row.children(".deco-resize-handle-two").addClass("deco-resize-handle-left");

                // Check if third column is selected
                } else if (cells.length == 3 && $(cells.get(2)).children(".deco-tile").hasClass("deco-selected-tile")) {

                    // Set location
                    row.children(".deco-resize-handle-one").addClass("deco-resize-handle-center");
                    row.children(".deco-resize-handle-two").addClass("deco-resize-handle-right");

                // No tile selected
                } else {

                    // Set location
                    row.children(".deco-resize-handle-one").addClass("deco-resize-handle-center");
                    row.children(".deco-resize-handle-two").addClass("deco-resize-handle-center");
                }
            }
        });
    };

    $.fn.decoGetDirection = function(e) {
        var width = parseFloat($(this).width());
        var height = parseFloat($(this).height());
        var x = parseFloat((e.pageX - $(this).offset().left) - (width / 2));
        var y = parseFloat((e.pageY - $(this).offset().top) - (height / 2));
        var halfwidth = width / 2;
        var halfheight = height / 2;

        // If left of center
        if (x < 0) {

            // If above center
            if (y < 0) {
                if ((x / y) < ((-1 * halfwidth) / (-1 * halfheight))) {
                    return "top";
                } else {
                    return "left";
                }
            // Below center
            } else {
                if ((x / y) < ((-1 * halfwidth) / (halfheight))) {
                    return "left";
                } else {
                    return "bottom";
                }
            }

        // Right of center
        } else {

            // If above center
            if (y < 0) {
                if ((x / y) < ((1 * halfwidth) / (-1 * halfheight))) {
                    return "right";
                } else {
                    return "top";
                }
            // Below center
            } else {
                if ((x / y) < ((halfwidth) / (halfheight))) {
                    return "bottom";
                } else {
                    return "right";
                }
            }
        }
    };

    $.decoGetWidthClassByInt = function (column_width) {
        switch (column_width) {
            case 25:
                return "deco-width-quarter";
                break;
            case 33:
                return "deco-width-third";
                break;
            case 50:
                return "deco-width-half";
                break;
            case 66:
            case 67:
                return "deco-width-two-thirds";
                break;
            case 75:
                return "deco-width-three-quarters";
                break;
            case 100:
                return "deco-width-full";
                break;
        }

        // Fallback
        return "deco-width-full";
    };

    $.decoGetPositionClassByInt = function (position) {
        switch (position) {
            case 0:
                return "deco-position-leftmost";
                break;
            case 25:
                return "deco-position-quarter";
                break;
            case 33:
                return "deco-position-third";
                break;
            case 50:
                return "deco-position-half";
                break;
            case 66:
            case 67:
                return "deco-position-two-thirds";
                break;
            case 75:
                return "deco-position-three-quarters";
                break;
        }

        // Fallback
        return "deco-position-leftmost";
    };

    $.decoFixWebkitSpan = function () {
        var webkit_span = $(".Apple-style-span");
        webkit_span.after(webkit_span.html());
        webkit_span.remove();
    }
})(jQuery);
