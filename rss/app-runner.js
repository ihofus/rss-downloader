var scheduler = require('node-cron');
var parser = require('rss-parser');
var processor = require('./processor');

module.exports = function () {
    var config;
    var tasks = [];
    var started = false;



    this.start = function (cfg) {
        if (started) {
            console.error('Allready started');
            return;
        }
        config = cfg;
        config.feeds
            .filter((feed) => feed.active || feed.active == undefined || feed.active == null)
            .forEach((feed) => processFeed(feed));
    }

    this.stop = function () {
        started = false;
        tasks.forEach((task) => task.destroy());
        tasks = [];
    };

    function processFeed(feed) {
        tasks.push(scheduler.schedule(feed.cron, () => loadRss(feed)));
    }

    function loadRss(feed) {
        parser.parseURL(feed['rss-url'], function (err, parsed) {
            if (err) {
                console.error(err);
                return;
            }
            processor(parsed, feed, config);
        });
    }
}