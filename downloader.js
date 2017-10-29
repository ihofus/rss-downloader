
var parser = require('rss-parser');
var scheduler = require('node-cron');
var fileHelper = require('./utils/file-helper');
var linkCache = require('./utils/link-cache');

var configer = require('/usr/config/configer');

configer.feeds.forEach((feed) => subscribeFeed(feed));

function subscribeFeed(feed) {
  scheduler.schedule(feed.scheduleCron, () => fetchRssFeed(feed));
}

function fetchRssFeed(feed) {
  parser.parseURL(feed.rssUrl, (err, parsed) => handleRssFeed(err, parsed, feed));
}

function handleRssFeed(err, parsed, feed) {
  if (err) {
    console.error(err);
    return;
  }

  parsed.feed.entries.forEach((entry) => handleFeedItem(entry, feed));
}

function handleFeedItem(entry, feed) {
  console.log('Processing RSS entry: ' + entry.title);
  feed.matchers.forEach((matcher) => matchEntry(matcher, entry));
}

function matchEntry(matcher, entry) {
  if (matcher.matchItem(entry)) {
    if (!linkCache.downloaded(entry.link)) {
      var targetFile = matcher.targetFolder + matcher.fileNamer(entry);
      fileHelper.download(entry.link, targetFile, function () {
        linkCache.put(entry.link);
      })
    }
  }
}
