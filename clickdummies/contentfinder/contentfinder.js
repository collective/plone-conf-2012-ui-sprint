/*global finderdata:false*/

var ContentFinder = function(id, path, multiselect) {
    var self = this;
    self.id = id;
    self.container = $(id);
    self.multiselect = multiselect;
    self.activeresults = [];
    self.selecteditems = [];
    self.selectedresults = [];
    self.choices = $('.chzn-choices', self.container);
    self.dropdown = $('.chzn-drop', self.container);
    self.results = $('.chzn-results', self.container);
    self.input = $('.search-field input', self.container);
    self.input.attr('value', self.input.attr('data-placeholder'));

    var open_dropdown = function(e) {
        var tagName = $(e.target).prop('tagName');
        if (tagName === 'UL' || tagName === 'INPUT') {
            if (self.input.attr('value') === self.input.attr('data-placeholder')) {
                self.input.attr('value', '');
            }
            self.input.focus();
            self.dropdown.css({'left': 0});
        }
    };
    var close_dropdown = function(e) {
        var tagName = $(e.target).prop('tagName');
        if (tagName === 'UL' || tagName === 'INPUT') {
            if (self.input.attr('value') === '') {
                self.input.attr('value', self.input.attr('data-placeholder'));
            }
            self.input.focus();
            self.dropdown.css({'left': -9000});
        }
    };
    var keyboard_navigation = function (evt) {
        if (evt.target === self.input[0]) {
            switch(evt.keyCode){
                case 40:
                    // arrow down
                    if ($('.LSHighlight', self.results).length === 0) {
                        // highlight the first item in the list
                        self.results.children()
                            .first()
                            .addClass('LSHighlight');
                    } else {
                        // highlight the next item in the list
                        $('.LSHighlight', self.results)
                            .first()
                            .removeClass('LSHighlight')
                            .next()
                            .addClass('LSHighlight');
                    }
                    break;

                case 38:
                    // arrow up
                    if ($('.LSHighlight', self.results).length === 0) {
                        // highlight the last item in the list
                        self.results.children()
                            .last()
                            .addClass('LSHighlight');
                    } else {
                        // highlight the previous item in the list
                        $('.LSHighlight', self.results)
                            .first()
                            .removeClass('LSHighlight')
                            .prev()
                            .addClass('LSHighlight');
                    }
                    break;

                case 13:
                    // select item on Enter
                    if ($('.LSHighlight', self.results).length !== 0) {
                        $('.LSHighlight', self.results)
                            .first()
                            .click();
                    }
                    break;

                default:
                    return true;
            }
            evt.preventDefault();
        }
    };
    self.choices
        .toggle(open_dropdown, close_dropdown)
        .keydown(keyboard_navigation);
    self.current_path = path;
};

ContentFinder.prototype.selected_uids = function() {
    var uids = [];
    for (var i=0; i<this.selecteditems.length; i++) {
        var selected = this.selecteditems[i];
        uids.push(selected.uid);
    }
    return uids;
};

ContentFinder.prototype.listdir = function(path) {
    var self = this,
        html = [],
        selected, result, len;
    self.data = finderdata[path];
    // create the list of items to choose from
    for (var i=0; i<self.data.items.length; i++) {
        var item = self.data.items[i];
        var folderish = item.is_folderish ? ' folderish ' : ' not-folderish ';
        selected = $.inArray(item.uid, self.selected_uids()) !== -1;
        var selected_class = selected ? ' selected ' : '';
        $.merge(html, [
            '<li class="active-result' + folderish + selected_class + '" data-url="' + item.url + '" data-uid="' + item.uid + '">',
            '<span class="contenttype-' + item.normalized_type + '">' + item.title + '</span>',
            '</li>'
            ]
        );
    }
    this.results.html(html.join(''));

    /* rebuild the list of selected results
       this is necessary since selecteditems contains items selected
       across all folders
    */
    self.selectedresults = [];
    for (i=0; i<self.selecteditems.length; i++) {
        selected = self.selecteditems[i];
        result = $('li[data-uid="' + selected.uid + '"]', this.container);
        if (result.length > 0) {
            self.selectedresults.push(result);
        }
    }
    $('li.not-folderish', this.results)
        .unbind('.finderresult')
        .bind('click.finderresult', function() {
            self.result_click($(this));
            });

    $('li.folderish', this.container).single_double_click(
        function() {
            self.result_click($(this));
        },
        function(e) {
            e.preventDefault();
            e.stopPropagation();
            self.listdir($(this).attr('data-url'));
        }
    );

    // breadcrumbs
    html = [];
    len = self.data.path.length;
    $.each(self.data.path, function (i, item) {
        if (i > 0) {
            html.push(" / ");
        }
        html.push(item.icon);
        if (i === len - 1) {
            html.push('<span>' + item.title + '</span>');
        } else {
            html.push('<a href="' + item.url + '">' + item.title + '</a>');
        }
    });
    $('.internalpath', this.container).html(html.join(''));

    // breadcrumb link
    $('.internalpath a', this.container)
        .unbind('.finderpath')
        .bind('click.finderpath', function(e) {
            e.preventDefault();
            e.stopPropagation();
            self.listdir($(this).attr('href'));
        });

};

ContentFinder.prototype.select_item = function(uid) {
    var self = this, item;
    for (var i=0; i<self.data.items.length; i++) {
        item = self.data.items[i];
        if (item.uid === uid) {
            self.selecteditems.push(item);
        }
    }
};

ContentFinder.prototype.deselect_item = function(uid) {
    var self = this, lst = [], item;
    for (var i=0; i<self.selecteditems.length; i++) {
        item = self.selecteditems[i];
        if (item.uid !== uid) {
            lst.push(item);
        }
    }
    self.selecteditems = lst;
};

ContentFinder.prototype.result_click = function(item) {
    var self = this,
        selected, i, html = [];
    if (!self.multiselect) {
        selected = self.selectedresults[0];
        if (selected !== undefined && item !== selected) {
            selected.toggleClass('selected');
            self.deselect_item(selected.attr('data-uid'));
        }
        self.selectedresults = [item];
        item.toggleClass('selected');
        self.select_item(item.attr('data-uid'));
    } else {
        // remove item from list if it was deselected
        if (item.hasClass('selected')) {
            var new_lst = [];
            for (i=0; i<self.selectedresults.length; i++) {
                selected = self.selectedresults[i];
                if (selected.attr('data-uid') === item.attr('data-uid')) {
                    selected.toggleClass('selected');
                    self.deselect_item(selected.attr('data-uid'));
                } else {
                    new_lst.push(selected);
                }
            }
            self.selectedresults = new_lst;
        } else {
            self.selectedresults.push(item);
            self.select_item(item.attr('data-uid'));
            item.toggleClass('selected');
        }
    }

    // add selections to search input
    for (i=0; i < this.selecteditems.length; i++) {
        item = this.selecteditems[i];
        html.push('<li class="search-choice"><span>' +
                  item.title +
                  '</span><a href="javascript:void(0)" class="search-choice-close" rel="3" data-uid="' +
                  item.uid +
                  '"></a></li>');
    }
    $('.search-choice', self.choices).remove();
    self.choices.prepend(html.join(''));
    self.input.focus();

    $('a.search-choice-close', this.chosen)
        .unbind('.selected')
        .bind('click.selected', function() {
            var el = $(this);
            var uid = el.attr('data-uid');
            el.parent().remove();
            el = $('li.active-result[data-uid="' + uid + '"]');
            // only trigger result_click if the selected item is in the
            // of selected results
            if (el.length === 0) {
                self.deselect_item(uid);
                self.resize();
            }
            else {
                self.result_click(el);
            }
        });
    self.resize();
};

ContentFinder.prototype.resize = function() {
    var dd_top = this.container.height();
    this.dropdown.css({
        "top": dd_top + "px"
    });
};
$(document).ready(function () {
    $('.finder').each(function() {
        var url = $(this).attr('data-url');
        var finder = new ContentFinder('#'+$(this).attr('id'), url, true);
        finder.listdir(url);
    });
});
