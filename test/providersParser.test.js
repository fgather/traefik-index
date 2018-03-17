let chai = require('chai');
let expect = chai.expect;
let extractHosts = require('../routes/providersParser');

generateFrontendJson = (ruleString) => {
    return {docker: {frontends: {1: {routes: [{rule: ruleString}]}}}}
};

describe('Indexpage', function () {
    it('should show single host', function () {

        let testJson = generateFrontendJson('Host:testhost');
        let hostList = extractHosts(JSON.stringify(testJson), '');
        expect(hostList).to.eql(['testhost']);
    });

    it('should work with multiple hosts on one rule', function () {

        let testJson = generateFrontendJson('Host:testhost,testhost2');
        let hostList = extractHosts(JSON.stringify(testJson), '');
        expect(hostList).to.eql(['testhost','testhost2']);
    });

    it('should use the blacklist', function () {

        let blackList = "black.ist,teststring";

        let testJson = generateFrontendJson('Host:testhost,blacklisted');
        let hostList = extractHosts(JSON.stringify(testJson), blackList);
        expect(hostList).to.eql(['testhost']);
    });
});