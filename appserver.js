var express = require('express'),
    fs = require('fs'),
    url = require('url'),
    qs = require('querystring'),
    validator = require('./validator');

var app = express.createServer();
var gset = {
    host: 'dev-node.clique.kr',
    port: 8000,
    certPath: '/home/lch/pub.cer'
};
var gobj = {};

var signVerifier = validator.createSignVerifier(gset.certPath, 'http', gset.host, gset.port);

gobj.verify = function (protocol, req) {
    var purl = url.parse(req.url, true);
    var params = purl.query;
    var bodyParams = {};
    if (req.method == 'POST') {
        for (var k in req.body) {
            console.log(k);
        }
    }
    console.log('next');
    for (var k in params) {
        console.log(k);
    }
    return true;
};

app.use(express.bodyDecoder());
app.post('/engage/', function (req, res) {
    var method = req.method;
    var parsedURL = url.parse(req.url, true);
    req.setEncoding('utf8');
    var verified = signVerifier.verify(req);
    console.log('Verified!: ' + verified);
    res.send('{"hello":"guys"}');
});

app.listen(8000, 'dev-node.clique.kr');
