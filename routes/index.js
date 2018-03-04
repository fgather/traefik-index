var express = require('express');
var router = express.Router();
var request = require('request');

function extractHosts(providersJson) {
    try {
        var frontends = providersJson.docker.frontends;

        return Object.keys(frontends)
            .map(frontendKey => frontends[frontendKey])
            .map(frontend => frontend.routes)
            .map(route => route[Object.keys(route)[0]].rule)
            .filter(rule => rule.startsWith('Host:'))
            .map(rule => 'http://'+rule.replace('Host:',''));
    } catch (error) {
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
        res.render('index', {title: title, hosts: extractHosts(response)});
    });
});

module.exports = router;
