var url = require('url');

module.exports = {
    feeds: [
        {
            scheduleCron: '* * * * *',
            rssUrl: 'url',
            matchers: [
                {
                    name: 'Channel Zero',
                    matchItem: function (item) {
                        return item.title.includes('Channel Zero');
                    },
                    targetFolder: 'tmp/',
                    fileNamer: function (item) {
                        var parsedUrl = url.parse(item.link, true);
                        return parsedUrl.query.name;
                    }
                }
            ]
        }
    ]
}