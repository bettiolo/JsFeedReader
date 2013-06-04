google.load("feeds", "1");
google.setOnLoadCallback(function () {
    'use strict';
    $(function () {
        var source   = $("#story-template").html();
        var template = Handlebars.compile(source);
        $('section.feed-viewer-single').each(function () {
            var $container = $(this);
            $container.text("Loading feed...");
            var feedUrl = $container.data('feed-url');
            var feedEngine = new FeedEngine(feedUrl, template,
                function () {
                    var singleStoryViewer = new SingleStoryViewer(this, $container);
                },
                function (error) {
                    $container.text(error.message);
                }
            );
        });
    });
});