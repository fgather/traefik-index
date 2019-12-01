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
    } catch (e) {
        console.log(e);
        sectionTitle += ' ( could not obtain endpoint data )';
    }

    return {sectionTitle: sectionTitle, hosts: hosts};
}

async function getHostsForEndpoint(endPointConfiguration) {
    if (typeof endPointConfiguration.url !== 'undefined') {
        let result = await request(endPointConfiguration.url);
        let hosts = extractHostsAndApplyBlacklist(result, endPointConfiguration.blacklist);
        return hosts.sort();
    } else {
        let routersUrl = url.resolve(endPointConfiguration.apiUrl, 'http/routers');
        let result = await request(routersUrl);
        let hosts = extractHostsAndApplyBlacklistFromTraefik2(result, endPointConfiguration.blacklist);
        return hosts.sort();
    }
}

module.exports = router;
