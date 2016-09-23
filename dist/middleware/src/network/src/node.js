'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NodeHttp = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _promise = require('core-js/es6/promise');

var _promise2 = _interopRequireDefault(_promise);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NodeHttp = exports.NodeHttp = function () {
  function NodeHttp() {
    _classCallCheck(this, NodeHttp);
  }

  _createClass(NodeHttp, [{
    key: 'handle',
    value: function handle(request) {
      var promise = new _promise2.default(function (resolve, reject) {
        var method = request.method;
        var headers = request.headers;
        var body = request.body;

        var path = _url2.default.parse(request.url);
        var adapter = path.protocol === 'https:' ? _https2.default : _http2.default;

        // Set the Content-Length header if it doesn't already exist
        if (body && !headers['content-length'] && !headers['Content-Length']) {
          var length = 0;

          // Get the length of the body
          if (body instanceof Buffer) {
            length = body.length;
          } else if (body) {
            length = Buffer.byteLength(body);
          }

          // Set the Content-Length header
          headers['Content-Length'] = length;
        }

        var httpRequest = adapter.request({
          host: path.hostname,
          path: path.pathname + (path.search ? path.search : ''),
          port: path.port,
          method: method,
          headers: headers
        }, function (response) {
          var data = [];

          // Listen for data
          response.on('data', function (chunk) {
            data.push(new Buffer(chunk));
          });

          // Listen for request completion
          response.on('end', function () {
            resolve({
              response: {
                statusCode: response.statusCode,
                headers: response.headers,
                data: Buffer.concat(data)
              }
            });
          });
        });

        // Listen fro request errors
        httpRequest.on('error', function (error) {
          reject(error);
        });

        // Write the body
        if (body) {
          httpRequest.write(body);
        }

        // Initiate request
        httpRequest.end();
      });
      return promise;
    }
  }], [{
    key: 'isSupported',
    value: function isSupported() {
      return (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof window === 'undefined';
    }
  }]);

  return NodeHttp;
}();