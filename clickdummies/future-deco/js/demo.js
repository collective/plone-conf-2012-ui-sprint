(function($){

    // Init on document ready
    $(document).ready(function(){

        var configuration = {
            'global_actions': {
                'save_cancel': {
                    'label': 'Save/Cancel',
                    'actions': {
                        'save': {
                            'label': 'Save',
                            'action': 'save'
                        },
                        'cancel': {
                            'label': 'Cancel',
                            'action': 'cancel'
                        }
                    }
                },
                'undo_redo': {
                    'label': 'Undo/Redo',
                    'actions': {
                        'undo': {
                            'label': 'Undo',
                            'action': 'undo'
                        },
                        'redo': {
                            'label': 'Redo',
                            'action': 'redo'
                        }
                    }
                },
                'tile_align': {
                    'label': 'Tile align',
                    'actions': {
                        'tile_align_block': {
                            'label': 'Tile align block (default)',
                            'action': 'tile-align-block'
                        },
                        'tile_align_left': {
                            'label': 'Tile align left',
                            'action': 'tile-align-left'
                        },
                        'tile_align_right': {
                            'label': 'Tile align right',
                            'action': 'tile-align-right'
                        }
                    }
                }
            },
            'styles': {
                'text': {
                    'label': 'Text',
                    'actions': {
                        'bold': {
                            'label': 'Bold',
                            'action': 'bold',
                            'favorite': true
                        },
                        'italic': {
                            'label': 'Italic',
                            'action': 'italic',
                            'favorite': true
                        },
                        'paragraph': {
                            'label': 'Paragraph',
                            'action': 'paragraph',
                            'favorite': false
                        },
                        'heading': {
                            'label': 'Heading',
                            'action': 'heading',
                            'favorite': false
                        },
                        'subheading': {
                            'label': 'Subheading',
                            'action': 'subheading',
                            'favorite': false
                        },
                        'discreet': {
                            'label': 'Discreet',
                            'action': 'discreet',
                            'favorite': false
                        },
                        'literal': {
                            'label': 'Literal',
                            'action': 'literal',
                            'favorite': false
                        },
                        'quote': {
                            'label': 'Quote',
                            'action': 'quote',
                            'favorite': false
                        },
                        'callout': {
                            'label': 'Callout',
                            'action': 'callout',
                            'favorite': false
                        }
                    }
                },
                'selection': {
                    'label': 'Selection',
                    'actions': {
                        'highlight': {
                            'label': 'Highlight',
                            'action': 'highlight',
                            'favorite': false
                        },
                        'sub': {
                            'label': 'Subscript',
                            'action': 'sub',
                            'favorite': false
                        },
                        'sup': {
                            'label': 'Superscript',
                            'action': 'sup',
                            'favorite': false
                        },
                        'remove-style': {
                            'label': '(remove style)',
                            'action': 'remove-style',
                            'favorite': false
                        }
                    }
                },
                'lists': {
                    'label': 'Lists',
                    'actions': {
                        'ul': {
                            'label': 'Unordered list',
                            'action': 'ul',
                            'favorite': false
                        },
                        'ol': {
                            'label': 'Ordered list',
                            'action': 'ol',
                            'favorite': false
                        }
                    }
                },
                'justify': {
                    'label': 'Justify',
                    'actions': {
                        'justify-left': {
                            'label': 'Left-aligned',
                            'action': 'justify-left',
                            'favorite': false
                        },
                        'justify-center': {
                            'label': 'Center',
                            'action': 'justify-center',
                            'favorite': false
                        },
                        'justify-right': {
                            'label': 'Right-aligned',
                            'action': 'justify-right',
                            'favorite': false
                        },
                        'justify-justify': {
                            'label': 'Justified',
                            'action': 'justify-justify',
                            'favorite': false
                        }
                    }
                },
                'print': {
                    'label': 'Print',
                    'actions': {
                        'pagebreak': {
                            'label': 'Page break',
                            'action': 'pagebreak',
                            'favorite': false
                        }
                    }
                }
            },
            'tiles': {
                'structure': {
                    'label': 'Structure',
                    'tiles': {
                        'text': {
                            'label': 'Text',
                            'type': 'text',
                            'default_value': '<p>New block</p>',
                            'read_only': false,
                            'settings': true,
                            'favorite': false,
                            'rich_text': true,
                            'available_actions': ['bold', 'italic', 'paragraph', 'heading', 'subheading', 'discreet', 'literal', 'quote', 'callout', 'highlight', 'sub', 'sup', 'remove-style', 'pagebreak', 'ul', 'ol', 'justify-left', 'justify-center', 'justify-right', 'justify-justify', 'tile-align-block', 'tile-align-right', 'tile-align-left']
                        }
                    }
                },
                'media': {
                    'label': 'Media',
                    'tiles': {
                        'image': {
                            'label': 'Image',
                            'type': 'app',
                            'default_value': '<img src="images/image-placeholder.png" alt="New image"/>',
                            'read_only': true,
                            'settings': true,
                            'favorite': false,
                            'rich_text': false,
                            'available_actions': ['tile-align-block', 'tile-align-right', 'tile-align-left']
                        },
                        'pony': {
                            'label': 'Pony',
                            'type': 'app',
                            'default_value': "<pre>\n        .,,.\n     ,;;*;;;;,\n    .-'``;-');;.\n   /'  .-.  /*;;\n .'    \d    \;;               .;;;,\n/ o      `    \;    ,__.     ,;*;;;*;,\n\__, _.__,'   \_.-') __)--.;;;;;*;;;;,\n `\"\"`;;;\       /-')_) __)  `\' ';;;;;;\n    ;*;;;        -') `)_)  |\ |  ;;;;*;\n    ;;;;|        `---`    O | | ;;*;;;\n    *;*;\|                 O  / ;;;;;*\n   ;;;;;/|    .-------\      / ;*;;;;;\n  ;;;*;/ \    |        '.   (`. ;;;*;;;\n  ;;;;;'. ;   |          )   \ | ;;;;;;\n  ,;*;;;;\/   |.        /   /` | ';;;*;\n   ;;;;;;/    |/       /   /__/   ';;;\n   '*jgs/     |       /    |      ;*;\n        `\"\"\"\"`        `\"\"\"\"`     ;'\n</pre>",
                            'read_only': true,
                            'settings': true,
                            'favorite': false,
                            'rich_text': false,
                            'available_actions': ['tile-align-block', 'tile-align-right', 'tile-align-left']
                        }
                    }
                },
                'fields': {
                    'label': 'Fields',
                    'tiles': {
                        'title': {
                            'label': 'Title',
                            'type': 'field',
                            'default_value': '<h2>Page title</h2>',
                            'read_only': false,
                            'settings': true,
                            'favorite': false,
                            'rich_text': true,
                            'available_actions': ['tile-align-block', 'tile-align-right', 'tile-align-left']
                        },
                        'description': {
                            'label': 'Description',
                            'type': 'field',
                            'default_value': '<p>Description</p>',
                            'read_only': false,
                            'settings': true,
                            'favorite': false,
                            'rich_text': true,
                            'available_actions': ['bold', 'italic', 'ul', 'ol', 'tile-align-block', 'tile-align-right', 'tile-align-left']
                        },
                        'author': {
                            'label': 'Author',
                            'type': 'field',
                            'default_value': '<p>Author</p>',
                            'read_only': true,
                            'settings': false,
                            'favorite': false,
                            'rich_text': true,
                            'available_actions': ['tile-align-block', 'tile-align-right', 'tile-align-left']
                        }
                    }
                }
            },
            'default_available_actions': ['save', 'cancel', 'undo', 'redo', 'insert']
        };

        // Add panel and toolbar to the configuration
        configuration['panel'] = 'panel-maincolumn';
        configuration['toolbar'] = 'toolbar-maincolumn';

        // Init toolbar
        $("#toolbar-maincolumn").decoToolbar(configuration);

        // Init main column panel
        $("#panel-maincolumn").decoLayout(configuration);

        // Init default actions
        $.decoInitDefaultActions();

        // Init notifications
        $.decoNotifications();

        $("#toggle").click(function () {
            if ($("#panel-maincolumn").hasClass("implicit")) {
                $("#panel-maincolumn").removeClass("implicit");
                $(this).attr("value", "Explicit mode (click for implicit)");
            } else {
                $("#panel-maincolumn").addClass("implicit");
                $(this).attr("value", "Implicit mode (click for explicit)");
            }
        })
    });
})(jQuery);
