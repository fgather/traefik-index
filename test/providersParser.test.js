let chai = require('chai');
let expect = chai.expect;
let extractHosts = require('../routes/providersParser');

generateFrontendJson = (ruleString) => {
    return {docker: {frontends: {1: {routes: {'test': {rule: ruleString}}}}}}
};

generateK8sFrontendJson = (ruleString) => {
    return {kubernetes: {frontends: {1: {routes: {'test': {rule: ruleString}}}}}}
};

generateFrontendWithMultipleRulesJson = (ruleString) => {
    return {kubernetes: {frontends: {1: {routes: {'test': {rule: "path"}, 'test2': {rule: ruleString}}}}}}
};


describe('providersParser', function () {
    it('should show single host', function () {
        let testJson = generateFrontendJson('Host:testhost');
        let hostList = extractHosts(JSON.stringify(testJson), '');
        expect(hostList).to.eql(['testhost']);
    });

    it('should work with multiple hosts on one rule', function () {
        let testJson = generateFrontendJson('Host:testhost,testhost2');
        let hostList = extractHosts(JSON.stringify(testJson), '');
        expect(hostList).to.eql(['testhost', 'testhost2']);
    });

    it('should use the blacklist', function () {
        let blackList = "black.ist,teststring";

        let testJson = generateFrontendJson('Host:testhost,blacklisted');
        let hostList = extractHosts(JSON.stringify(testJson), blackList);
        expect(hostList).to.eql(['testhost']);
    });

    it('should work with non-docker providers', function () {
        let testJson = generateK8sFrontendJson('Host:testhost');
        let hostList = extractHosts(JSON.stringify(testJson), '');
        expect(hostList).to.eql(['testhost']);
    });

    it('should work with multiple rules per frontend', function () {
        let testJson = generateFrontendWithMultipleRulesJson('Host:testhost');
        let hostList = extractHosts(JSON.stringify(testJson), '');
        expect(hostList).to.eql(['testhost']);
    });

    it('should not fail if rules are empty', function () {
        let testJson = {kubernetes: {frontends: {1: {routes: {'test': {}, 'test2': {rule: 'Host:testhost'}}}}}};
        let hostList = extractHosts(JSON.stringify(testJson), '');
        expect(hostList).to.eql(['testhost']);
    });
});