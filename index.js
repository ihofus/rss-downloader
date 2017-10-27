var http = require('https');
var fs = require('fs');
var parser = require('rss-parser');
var url = require('url');
var scheduler = require('node-cron');
var config = require('./config');
const uuid = require('uuid/v4');

var defaultCron = config.cron || '0 * * * *';

config.feeds.forEach((elem) => subscribe(elem));

function subscribe(feed) {
  console.log('Subscribing to feed: ' + (feed.name || 'No name'));

  var cron = feed.cron || defaultCron;
  console.log('Cron: ' + cron);

  scheduler.schedule(cron, () => loadRssFeed(feed.url, feed.patterns));
}

function loadRssFeed(rssUrl, patterns) {
  console.log('Loading RSS url: ' + rssUrl);

  parser.parseURL(rssUrl, (err, parsed) => handleRssFeed(err, parsed, patterns));
}

function handleRssFeed(err, parsed, patterns) {
  console.log('RSS feed title: ' + parsed.feed.title);

  parsed.feed.entries.forEach((entry) => handleFeedItem(entry, patterns));
}

function handleFeedItem(item, patterns) {
  console.log('Processing item: ' + item.title);

  patterns.forEach(function (pattern) {
    console.log('Processing patern: ' + (pattern.name || 'no name'))
    var match = true;
    pattern.regex.forEach(function (regex) {
      var re = new RegExp(regex);
      match = match && re.test(item.title);
    });

    if (match) {
      console.log('matches');
      download(item.link, pattern.targetFolder);
    }

  });
}

function download(link, target) {
  var file = fs.createWriteStream(target + uuid() + '.torrent');
  var request = http.get(link, function (response) {
    response.pipe(file);
  });
}