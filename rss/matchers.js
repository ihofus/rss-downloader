module.exports = {
    basic: function (text, includes, excludes) {
        includes = includes || [];
        excludes = excludes || [];
        var line = text.toLowerCase();
        var result = includes.map(text => text.toLowerCase())
            .map(text => line.includes(text))
            .reduce((prev, curr) => prev && curr, true);

        return result && (excludes || []).map(text => text.toLowerCase())
            .map(text => !line.includes(text))
            .reduce((prev, curr) => prev && curr, true);
    }
};