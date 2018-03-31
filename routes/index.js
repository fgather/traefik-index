let express = require('express');
let router = express.Router();
let request = require('request-promise-native');
let extractHosts = require('./providersParser');


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
    let result = await request(endPointConfiguration.url);
    let hosts = extractHosts(result, endPointConfiguration.blacklist);
    return hosts.sort();
}

module.exports = router;
