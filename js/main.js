google.load("feeds", "1");
google.setOnLoadCallback(function () {
    'use strict';
    $(function () {
        var uiHandler = new UiHandler();
        var feedUi = new FeedUi();
    });
});

var UiHandler = (function () {
    'use strict';

    function UiHandler() {
        this.initTabs();
    }

    UiHandler.prototype.MAIN_TAB_SELECTOR = '#mainTabs';

    UiHandler.prototype.initTabs = function () {
        $(this.MAIN_TAB_SELECTOR).find('a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });
    };

    return UiHandler;

})();

var FeedUi = (function () {
    'use strict';

    FeedUi.prototype.STORY_TEMPLATE_SELECTOR = '#story-template';
    FeedUi.prototype.FEED_URLS_SELECTOR = '#feedUrls';
    FeedUi.prototype.SINGLE_STORIES_CONTAINER_SELECTOR = '#newspaper';

    function FeedUi() {
        this._source  = $(this.STORY_TEMPLATE_SELECTOR).html();
        this._template = Handlebars.compile(this._source);
        this._$container = $(this.SINGLE_STORIES_CONTAINER_SELECTOR);
        this._$log = this._$container.find('ul.log');
        this._$log.empty();
        this._logMessages = [];
        this._feedUrls = [];
        this._feeds = [];
        this.initSingleStoryViewer();
    }

    FeedUi.prototype.initSingleStoryViewer = function () {
        var self = this;
        var feedUrlsString = $(this.FEED_URLS_SELECTOR).val();
        var feedUrls = feedUrlsString.match(/[^\r\n]+/g);
        var feedUrlsCount = feedUrls.length;
        var i;
        var feedUrl = '';
        this._$container.empty();
        for (i = 0; i < feedUrlsCount; i++) {
            feedUrl = $.trim(feedUrls[i]);
            if (feedUrl) {
                this.log("Loading feed: " + feedUrl);
                this._feedUrls.push(feedUrl);
                this._feeds.push(new FeedEngine(feedUrl, this._template,
                    function () {
                        var singleStoryViewer = new SingleStoryViewer(this, self._$container);
                    },
                    function (error) {
                        this.log(error.message);
                    }
                ));
            }
        }
    };

    FeedUi.prototype.log = function (value) {
        this._logMessages.push(value);
        this._$log.append('<li>' + value + '</li>');
    };

    return FeedUi;

})();
