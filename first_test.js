var webdriverio = require('webdriverio');
var mocha = require('mocha');
var options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};

webdriverio
    .remote(options)
    .init();

describe('my awesome website', function () {
    it('should do some chai assertions', function () {
        browser.url('http://webdriver.io');
        browser.getTitle().should.be.equal('WebdriverIO - WebDriver bindings for Node.js');
    });
});