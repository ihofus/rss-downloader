var http = require('http');
var https = require('https');
var url = require('url');
var fs = require('fs');

function onResponse(response, file, onDownload) {
    onDownload();
    response.pipe(file);
}

module.exports = {

    download: function (link, targetFile, onDownload) {
        var parsedLink = url.parse(link, true);
        var file = fs.createWriteStream(targetFile);
        console.log('Downloading ' + link + ' into ' + targetFile);

        switch (parsedLink.protocol) {
            case "http:":
                http.get(link, (response) => onResponse(response, file, onDownload));
                break;
            case "https:":
                https.get(link, (response) => onResponse(response, file, onDownload));
                break;
        }
    }
};

