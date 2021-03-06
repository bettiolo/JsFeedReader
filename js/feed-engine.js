
var FeedEngine = (function () {
    'use strict';

    function FeedEngine(feedUrl, template, feedLoadedCallback, feedErrorCallback) {
        this._feedUrl = feedUrl;
        this._feed = null;
        this._feedLoaded = feedLoadedCallback;
        this._feedError = feedErrorCallback;
        this._template = template;
        this._firstRun = true;
        this.loadFeed();
    }

    FeedEngine.prototype.loadFeed = function () {
        var self = this;
        var feed = new google.feeds.Feed(this._feedUrl);
        feed.setNumEntries(10);
        feed.includeHistoricalEntries();
        feed.load(function(result) {
            if (!result.error) {
                self._feed = result.feed;
                self._feedLoaded();
            } else {
                if (self._firstRun) {
                    self._firstRun = false;
                    self.findFeed();
                } else {
                    self._feedError(result.error);
                }
            }

        });
    };

    FeedEngine.prototype.findFeed = function () {
        var self = this;
        google.feeds.lookupFeed(this._feedUrl, function() {
            if (this.url) {
                self._feedUrl = this.url;
            }
            self.loadFeed();
        });
    };

    FeedEngine.prototype.getFeed = function () {
        return this._feed;
    };

    FeedEngine.prototype.getEntries = function () {
        return this._feed.entries;
    };

    FeedEngine.prototype.getTemplate = function () {
        return this._template;
    };

    return FeedEngine;

})();

var SingleStoryViewer = (function () {
    'use strict';

    function SingleStoryViewer(feedEngine, $container) {
        this._feedEngine = feedEngine;
        this._$container = $container;
        this._$story = null;
        this._feed = this._feedEngine.getFeed();
        this._entries = this._feedEngine.getEntries();
        this._entryCount = this._entries.length;
        this._index = 0;
        if (this._entryCount > 0) {
            this.displayEntry();
        }
    }

    SingleStoryViewer.prototype.displayEntry = function () {
        var entry = this._entries[this._index];
        var template = this._feedEngine.getTemplate();
        var content = {
            feedName : this._feed.title,
            title: entry.title,
            author: entry.author,
            date: entry.publishedDate,
            content: entry.contentSnippet,
            link: entry.link,
            index: this._index + 1,
            total: this._entries.length
        };
        var storyElement = $($.trim(template(content)));
        if (this._$story) {
            this._$story.replaceWith(storyElement);
            this._$story = storyElement;
        } else {
            this._$story = storyElement;
            this._$container.append(this._$story);
        }
        this._bindControls();
    };


    SingleStoryViewer.prototype._bindControls = function () {
        this._$story.find('a.previous-story').click(this.displayPrevious.bind(this));
        this._$story.find('a.next-story').click(this.displayNext.bind(this));
    };

    SingleStoryViewer.prototype.displayPrevious = function () {
        if (this._index < this._entryCount - 1) {
            this._index++;
            this.displayEntry();
        }
        return false;
    };

    SingleStoryViewer.prototype.displayNext = function () {
        if (this._index > 0) {
            this._index--;
            this.displayEntry();
        }
        return false;
    };

    return SingleStoryViewer;

})();