var ContentFinder = function(id, path) {
    var self = this;
    this.id = id;
    this.container = $(id);
    this.dropdown = $('.chzn-drop', this.container);
    this.results = $('.chzn-results', this.container);
    this.input = $('.search-field input', this.container);
    this.input.attr('value', this.input.attr('data-placeholder'));
    $(this.input).toggle(function() {
        console.log('toggle');
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
}


$(document).ready(function () {
    $('.finder').each(function() {
        var url = $(this).attr('data-url');
        var finder = new ContentFinder('#'+$(this).attr('id'), url);
        finder.listdir(url);
    });
});
