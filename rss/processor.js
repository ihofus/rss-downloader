var matchers = require('./matchers');
var linkCache = require('./link-cache');
var fileHelper = require('./file-helper');
var url = require('url');
var path = require('path');

module.exports = function (rss, feed, config) {
    rss.feed.entries.forEach((entry) => handleRssEntry(entry, feed, config));
}

function handleRssEntry(entry, feed, config) {
    console.log('Processing RSS entry: ' + entry.title);
    feed.matchers.forEach((matcher) => matchEntry(entry, matcher, config));
}

function matchEntry(entry, matcher, config) {
    var matcherType = matcher.type || 'basic';
    var matched = false;
    switch (matcherType) {
        case 'basic':
            matched = matchers.basic(entry.title, matcher.params.includes, matcher.params.excludes);
            break;
        default: matched = false;
    }

    if (matched && !linkCache.has(entry.link)) {
        console.log('Matched: ' + entry.title);
        var root = config['root-dir'] || '';
        var fileName = genFileName(entry, matcher['naming-strategy'], matcher['naming-params']);
        var targetFile = matcher['ignore-root'] ? path.join(matcher.targetFolder, fileName) : path.join(root, matcher['target-dir'], fileName);
        fileHelper.download(entry.link, targetFile, function () {
            linkCache.put(entry.link);
        });
    }
}

function genFileName(entry, namingStrategy, params) {
    namingStrategy = namingStrategy || 'from-link-path';
    switch (namingStrategy) {
        case 'from-link-path':
            var parsedUrl = url.parse(entry.link);
            return parsedUrl.pathname.split('/').pop();
        case 'from-link-query':
            var parsedUrl = url.parse(entry.link, true);
            return parsedUrl.query[params.key || 'name'];
        default:
            return new Date().getTime() + '.ext';
    }
}