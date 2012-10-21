var ContentFinder = function(id, path, multiselect) {
    var self = this;
    self.id = id;
    self.container = $(id);
    self.multiselect = multiselect;
    self.selecteditems = [];
    self.choices = $('.chzn-choices', self.container);
    self.dropdown = $('.chzn-drop', self.container);
    self.results = $('.chzn-results', self.container);
    self.input = $('.search-field input', self.container);
    self.input.attr('value', self.input.attr('data-placeholder'));
    $(self.input).toggle(function() {
        if (self.input.attr('value') == self.input.attr('data-placeholder')) {
            self.input.attr('value', '');
        };
        self.dropdown.css({'left': 0});
    }, function() {
        if (self.input.attr('value') == '') {
            self.input.attr('value', self.input.attr('data-placeholder'));
        };
        self.dropdown.css({'left': -9000});
    });
    self.current_path = path;
};

ContentFinder.prototype.listdir = function(path) {
    console.log(path);
    var self = this;
    var html = [];
    var data = finderdata[path];
    var items = data.items;
    for (var i=0; i<items.length; i++) {
        var item = items[i];
        var folderish = item.is_folderish ? ' folderish ' : '';
        $.merge(html, [
            '<li class="active-result' + folderish + '" data-url="' + item.url + '" data-uid="' + item.uid + '">',
            '<span class="contenttype-' + item.normalized_type + '">' + item.title + '</span>',
            '</li>'
            ]
        )
    }
    this.results.html(html.join(''));
    $('li', this.results)
        .unbind('.finderresult')
        .bind('click.finderresult', function() {
            self.select_item($(this))
            });

    $('li.folderish', document)
        .unbind('.finderdblclick')
        .bind('dblclick.finderdblclick', function(e) {
            e.preventDefault();
            e.stopPropagation();
            self.listdir($(this).attr('data-url'));
        });

    // breadcrumbs
    html = [];
    len = data.path.length;
    $.each(data.path, function (i, item) {
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

}

ContentFinder.prototype.select_item = function(item) {
    var self = this;
    if (!self.multiselect) {
        var selected = self.selecteditems[0];
        if (selected != undefined && item != selected) {
            selected.toggleClass('selected');
        }
        self.selecteditems = [item];
        item.toggleClass('selected');
    } else {
        // remove item from list if it was deselected
        if (item.hasClass('selected')) {
            var new_lst = []
            for (var i=0; i<self.selecteditems.length; i++) {
                var selected = self.selecteditems[i];
                if (selected.attr('data-uid') == item.attr('data-uid')) {
                    selected.toggleClass('selected');
                } else {
                    new_lst.push(selected);
                }
            }
            self.selecteditems = new_lst;
        } else {
            self.selecteditems.push(item);
            item.toggleClass('selected');
        }
    }

    // add selections to search input
    html = []
    for (var i=0; i < this.selecteditems.length; i++) {
        var item = this.selecteditems[i];
        html.push('<li class="search-choice"><span>' + item.text() + '</span><a href="javascript:void(0)" class="search-choice-close" rel="3" data-uid="' + item.attr('data-uid') + '"></a></li>');
    }
    html.push('<li class="search-field"><input type="text" style="width: 172px;" autocomplete="off" class="default" data-placeholder="Click to search or browse"></li>');
    self.choices.html(html.join(''));

    $('a.search-choice-close', this.chosen)
        .unbind('.selected')
        .bind('click.selected', function() {
            var el = $(this);
            var uid = el.attr('data-uid');
            el.parent().remove();
            var el = $('li.active-result[data-uid="' + uid + '"]');
            self.select_item(el);
        });

};


$(document).ready(function () {
    $('.finder').each(function() {
        var url = $(this).attr('data-url');
        var finder = new ContentFinder('#'+$(this).attr('id'), url, true);
        finder.listdir(url);
    });
});
