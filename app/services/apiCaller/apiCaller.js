const rp = require('request-promise-native');

class ApiCaller {
    constructor(uri, method, body) {
        console.log(uri, method, body);
        this.body = body || {};
        this.options = {
            method: method || 'POST',
            uri: uri,
            json: true,
            simple: false,
            body: body || {},
            resolveWithFullResponse: false,
            rejectUnauthorized: false,
        };
    }

    call() {
        return rp(this.options);
    }

}

module.exports = ApiCaller;
