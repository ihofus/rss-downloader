var flatCache = require('flat-cache')
var cache = flatCache.load('cacheId');

module.exports = {
    put: function (link) {
        cache.setKey(link, true);
        cache.save(true);
    },
    has: function (link) {
        return cache.getKey(link);
    }
}