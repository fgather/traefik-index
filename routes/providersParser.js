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

    let routes = flatten(Object.keys(frontends)
        .map(frontendKey => frontends[frontendKey])
        .map(frontend => frontend.routes));

    let hostNames = flatten(routes
        .map(route => route.rule)
        .filter(rule => rule.startsWith('Host:'))
        .map(rule => rule.replace('Host:', ''))
        .map(hostRuleString => hostRuleString.split(',')));

    return hostNames
        .filter(hostName => !blacklistRegExps.find(blackListItem => blackListItem.test(hostName)))
};

module.exports = extractHosts;