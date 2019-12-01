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

function extractRules(providersJson) {
    let parsedJson = JSON.parse(providersJson);
    let frontends = Object.keys(parsedJson).map(frontendName => parsedJson[frontendName].frontends)[0];
    let routes = flatten(Object.keys(frontends)
        .map(frontendKey => frontends[frontendKey])
        .map(frontend => frontend.routes));

    return flatten(routes.map(route =>
        Object.keys(route).map(routeKey => route[routeKey]).map(route => route.rule)));
}

function extractRulesFromTraefik2(routersJson) {
    let parsedJson = JSON.parse(routersJson);
    return parsedJson.map(route => route.rule);
}

function extractHostsFromRules(rules) {
    return flatten(
        rules.filter(rule => rule)
            .filter(rule => rule.startsWith('Host'))
            .map(rule => rule.replace(/Host:|Host\(`(\w+)`\)/, '$1'))
            .map(hostRuleString => hostRuleString.split(',')));
}

function applyBlacklist(hostNames, blacklistString) {
    let blacklist = blacklistString === '' ? [] : blacklistString.split(',');
    let blacklistRegExps = blacklist.map(regExString => new RegExp(regExString));

    return unique(hostNames
        .filter(hostName => !blacklistRegExps.find(blackListItem => blackListItem.test(hostName))))
}

exports.extractHostsAndApplyBlacklist = (providersJson, blacklistString) => {
    let rules = extractRules(providersJson);

    let hostNames = extractHostsFromRules(rules);
    return applyBlacklist(hostNames, blacklistString);
};

exports.extractHostsAndApplyBlacklistFromTraefik2 = (routersJson, blacklistString) => {
    let rules = extractRulesFromTraefik2(routersJson);

    let hostNames = extractHostsFromRules(rules);
    return applyBlacklist(hostNames, blacklistString);
};