const {extractHostsAndApplyBlacklistFromTraefik2} = require("../routes/providersParser");
const {extractHostsAndApplyBlacklist} = require("../routes/providersParser");
let express = require('express');
let router = express.Router();
let request = require('request-promise-native');
let url = require('url');


router.get('/', function (req, res, next) {

    let configuration = JSON.parse(process.env.ENDPOINTCONFIGURATION);

    Promise.all(configuration.endpoints.map(configuration => getEndpointResult(configuration))).then(endPointView => {
        res.render('index', {title: configuration.title, endPoints: endPointView});
    });
});

async function getEndpointResult(endPointConfiguration) {
    let hosts = [];
    let sectionTitle = endPointConfiguration.sectionTitle;

    try {
        hosts = await getHostsForEndpoint(endPointConfiguration);
        hosts = hosts.concat(getAdditionalHosts(endPointConfiguration.additionalHosts));
        hosts = hosts.sort();
    } catch (e) {
        console.log(e);
        sectionTitle += ' ( could not obtain endpoint data )';
    }

    return {sectionTitle: sectionTitle, hosts: hosts};
}

async function getHostsForEndpoint(endPointConfiguration) {
    let hosts = [];
    if (typeof endPointConfiguration.url !== 'undefined') {
        let result = await request(endPointConfiguration.url);
        hosts = extractHostsAndApplyBlacklist(result, endPointConfiguration.blacklist);
    }
    if (typeof endPointConfiguration.apiUrl !== 'undefined') {
        let routersUrl = url.resolve(endPointConfiguration.apiUrl, 'http/routers?search=&status=&per_page=10000&page=1');
        let result = await request(routersUrl);
        hosts = extractHostsAndApplyBlacklistFromTraefik2(result, endPointConfiguration.blacklist);
    }
    return hosts;
}

function getAdditionalHosts(additionalHosts) {
    if (typeof additionalHosts != 'undefined')
        return additionalHosts;
    else
        return [];
}

module.exports = router;
