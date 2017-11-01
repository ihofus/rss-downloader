module.exports = {
    basic: function (toString, includes, excludes) {
        return function (item) {
            var line = toString(item).toLowerCase();
            var result = includes.map(text => text.toLowerCase())
                .map(text => line.includes(text))
                .reduce((prev, curr) => prev && curr, true);

            return result && (excludes || []).map(text => text.toLowerCase())
                .map(text => !line.includes(text))
                .reduce((prev, curr) => prev && curr, true);
        }
    }
};