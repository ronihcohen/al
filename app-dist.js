'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var https = require('https');
var config = require('./config.json');

var AL = (function () {
    function AL() {
        _classCallCheck(this, AL);

        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
        this.token = '';
    }

    _createClass(AL, [{
        key: 'getFBToken',
        value: function getFBToken() {
            var _this = this;

            return new _Promise(function (resolve, reject) {
                https.get({
                    host: 'graph.facebook.com',
                    path: '/v2.4/oauth/access_token?client_id=' + _this.clientId + '&client_secret=' + _this.clientSecret + '&grant_type=client_credentials'
                }, function (response) {
                    var body = '';
                    response.on('data', function (d) {
                        body += d;
                    });
                    response.on('end', function () {
                        var parsed = JSON.parse(body);
                        if (parsed.access_token) {
                            _this.token = parsed.access_token;
                            resolve(_this.token);
                        } else {
                            reject();
                        }
                    });
                });
            });
        }
    }]);

    return AL;
})();

var ALsession = new AL();
ALsession.getFBToken().then(function (res) {
    console.log(res);
})['catch'](function (err) {
    console.log(err);
});