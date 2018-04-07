function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

function unique(arr) {
    let u = {}, a = [];
    let i = 0, l = arr.length;
    for (; i < l; ++i) {
        if (!u.hasOwnProperty(arr[i])) {
            a.push(arr[i]);
            u[arr[i]] = 1;
        }
    }
    return a;
}

extractHosts = (providersJson, blacklistString) => {
    let parsedJson = JSON.parse(providersJson);
    let frontends = Object.keys(parsedJson).map(frontendName => parsedJson[frontendName].frontends)[0];
    let blacklist = blacklistString === '' ? [] : blacklistString.split(',');

    let blacklistRegExps = blacklist.map(regExString => new RegExp(regExString));

    let routes = flatten(Object.keys(frontends)
        .map(frontendKey => frontends[frontendKey])
        .map(frontend => frontend.routes));

    let rules = flatten(routes.map(route =>
        Object.keys(route).map(routeKey => route[routeKey]).map(route => route.rule)));

    let hostNames = flatten(
        rules.filter(rule => rule)
            .filter(rule => rule.startsWith('Host:'))
            .map(rule => rule.replace('Host:', ''))
            .map(hostRuleString => hostRuleString.split(',')));

    return unique(hostNames
        .filter(hostName => !blacklistRegExps.find(blackListItem => blackListItem.test(hostName))))
};

module.exports = extractHosts;