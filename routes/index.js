let express = require('express');
let router = express.Router();
let request = require('request');

function extractHosts(providersJson) {
    try {
        let frontends = JSON.parse(providersJson).docker.frontends;

        return Object.keys(frontends)
            .map(frontendKey => frontends[frontendKey])
            .map(frontend => frontend.routes)
            .map(route => route[Object.keys(route)[0]].rule)
            .filter(rule => rule.startsWith('Host:'))
            .map(rule => 'http://'+rule.replace('Host:',''));
    } catch (error) {
        console.log(error);
        return [];
    }
}

router.get('/', function (req, res, next) {
    let title = process.env.INDEXPAGETITLE;
    title = title ? title : 'Index';

    let traefikEndpoint = process.env.ENDPOINTURL;

    request(traefikEndpoint, function (error, response, body) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('portainer providers:', body);

        let hosts = extractHosts(body);
        hosts.sort();

        res.render('index', {title: title, hosts: hosts});
    });
});

module.exports = router;
