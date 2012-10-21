var ContentFinder = function(id, path, multiselect) {
    var self = this;
    this.id = id;
    this.container = $(id);
    this.multiselect = multiselect;
    this.selecteditems = [];
    this.dropdown = $('.chzn-drop', this.container);
    this.results = $('.chzn-results', this.container);
    this.input = $('.search-field input', this.container);
    this.input.attr('value', this.input.attr('data-placeholder'));
    $(this.input).toggle(function() {
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
    this.current_path = path;
};

ContentFinder.prototype.listdir = function(path) {
    var self = this;
    var html = [];
    var items = finderdata[path].items;
    for (var i=0; i<items.length; i++) {
        var item = items[i];
        $.merge(html, [
            '<li class="active-result" data-url="' + item.url + '" data-uid="' + item.uid + '">',
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
        console.log(self.selecteditems);
    }
};


$(document).ready(function () {
    $('.finder').each(function() {
        var url = $(this).attr('data-url');
        var finder = new ContentFinder('#'+$(this).attr('id'), url, true);
        finder.listdir(url);
    });
});
