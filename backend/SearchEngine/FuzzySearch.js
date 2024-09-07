const fuzzysort = require('fuzzysort');

const fuzzySearch = (searchTerm, items, keys) => {
    const options = {
        keys: keys,
        threshold: -10000,
        allowTypo: true,
        limit: 10
    };

    return fuzzysort.go(searchTerm, items, options);
};

module.exports = fuzzySearch;
