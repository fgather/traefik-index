var express = require('express');
var router = express.Router();
var request = require('request');

function extractHosts(providersJson) {
    try {
        var frontends = JSON.parse(providersJson).docker.frontends;

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
    var title = process.env.INDEXPAGETITLE;
    title = title ? title : 'Index';

    var traefikEndpoint = process.env.ENDPOINTURL;

    request(traefikEndpoint, function (error, response, body) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('portainer providers:', body);

        var hosts = extractHosts(body);
        hosts.sort();

        res.render('index', {title: title, hosts: hosts});
    });
});

module.exports = router;
