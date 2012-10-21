var ContentFinder = function(id, path) {
    var self = this;
    this.id = id;
    this.container = $(id);
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
    var html = [];
    if (path == '/Plone') {
        html.push(
            '<li data-path="/Plone/front-page" class="active-result"><span data-uid="811793d984af4c2dbdf4db2080df1e27" class="contenttype-document">Welcome to Plone</span></li>'
        )
        html.push(
            '<li data-path="/Plone/news" class="active-result"><span data-uid="811793d984af4c2dbdf4db2080df1e27" class="contenttype-folder">News</span></li>'
        )
        html.push(
            '<li data-path="/Plone/events" class="active-result"><span data-uid="811793d984af4c2dbdf4db2080df1e27" class="contenttype-folder">Events</span></li>'
        )
        html.push(
            '<li data-path="/Plone/Members" class="active-result"><span data-uid="811793d984af4c2dbdf4db2080df1e27" class="contenttype-folder">Users</span></li>'
        )
    }
    this.results.html(html.join(''));
}


$(document).ready(function () {
    var finder = new ContentFinder('#related_items_finder', '/Plone');
    finder.listdir('/Plone');
});
