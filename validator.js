var url = require('url'),
    fs = require('fs'),
    crypto = require('crypto');

function normalizeQuery(query, postData) {
    delete query.oauth_signature;
    if (postData) {
        for (var k in postData) {
            query[k] = postData[k];
        }
    }
    var queryKeys = Object.keys(query).sort();
    var resultString = new String();
    for (var i in queryKeys) {
        var k = queryKeys[i];
        resultString += encodeURIComponent(k) + '=' + encodeURIComponent(query[k]) + '&';
    }
    resultString = resultString.substring(0, resultString.length - 1);
    return resultString;
}

// Signed Request Validator
exports.createSignVerifier = function (certPath, protocol, host, port) {
    this.cert = fs.readFileSync(certPath, 'ascii'); // Load cert key in PEM format
    this.host = protocol.toLowerCase() + '://' + host.toLowerCase() + ':' + port;
    this.verifier = crypto.createVerify('RSA-SHA1');
    this.verify = function (req) {
        var normalized = new Array();
        var parsedURL = url.parse(req.url, true);
        var signature = parsedURL.query.oauth_signature;
        var postData = null;
        
        normalized[0] = req.method.toUpperCase();
        normalized[1] = encodeURIComponent(this.host + parsedURL.pathname);
        if (normalized[0] == 'POST') {
            postData = req.body;
        }
        normalized[2] = escape(normalizeQuery(parsedURL.query, req.body));
        
        var baseString = normalized.join('&');
        this.verifier.update(baseString);
        console.log(baseString);
        
        return this.verifier.verify(this.cert, signature, 'base64');
    };
    return this;
};

/* These are for expansiblity of validating.
 * Not completely implemented yet.

exports.Verifier = function (initFunc) {
    this.setting = arguments[1];
    this.verify = arguments[2]; // Assign a verification function when creating a new Verifier
    initFunc(this.setting);
    return this;
};

exports.Validator = function (envObj) {
    this.env = envObj;
    this.setting.cert = fs.readFileSync(certFilePath, 'ascii');
    this.verifiers = {};
    this.addVerifier = function (label, vObject) {
        verifiers[label] = vObject;
    };
    this.removeVerifier = function (label) {
        delete verifiers[label];
    };
    this.verify = function (data) {
        var numOfLabels = arguments.length;
        var result = new Array();
        if (numOfLabels == 1) {
            for (var label in verifiers) {
                if (!verifiers[label].verify(data)) {
                    result.push(label);
                }
            }
        } else {
            for (var i in arguments) {
                if (!verifier[arguments[i]].verify(data)) {
                    result.push(label);
                }
            }
        }
        return result;
    };
    return this;
};
*/
