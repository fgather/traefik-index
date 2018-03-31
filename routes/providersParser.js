function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

extractHosts = (providersJson, blacklistString) => {
    let parsedJson = JSON.parse(providersJson);
    let frontends = Object.keys(parsedJson).map(frontendName => parsedJson[frontendName].frontends)[0];
    let blacklist = blacklistString === '' ? [] : blacklistString.split(',');

    let blacklistRegExps = blacklist.map(regExString => new RegExp(regExString));

    return flatten(Object.keys(frontends)
        .map(frontendKey => frontends[frontendKey])
        .map(frontend => frontend.routes)
        .map(route => route[Object.keys(route)[0]].rule)
        .filter(rule => rule.startsWith('Host:'))
        .map(rule => rule.replace('Host:', ''))
        .map(hostRuleString => hostRuleString.split(',')))
        .filter(hostName => !blacklistRegExps.find(blackListItem => blackListItem.test(hostName)))
};

module.exports = extractHosts;