let express = require('express');
let router = express.Router();
let request = require('request');
let extractHosts = require('./providersParser');


router.get('/', function (req, res, next) {
    let title = process.env.INDEXPAGETITLE;
    title = title ? title : 'Index';

    let traefikEndpoint = process.env.ENDPOINTURL;
    let blacklist = process.env.BLACKLIST ? process.env.BLACKLIST: '';

    request(traefikEndpoint, function (error, response, body) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('portainer providers:', body);

        let hosts = extractHosts(body, blacklist);
        hosts.sort();

        res.render('index', {title: title, hosts: hosts});
    });
});

module.exports = router;
