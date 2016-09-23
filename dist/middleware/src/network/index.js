'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // eslint-disable-line no-unused-vars


var _$http = require('./src/$http');

var _node = require('./src/node');

var _titanium = require('./src/titanium');

var _xhr = require('./src/xhr');

var _regeneratorRuntime = require('regenerator-runtime');

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Enum for Http Adapters.
 */
var HttpAdapter = {
  $Http: '$Http',
  Node: 'Node',
  Titanium: 'Titanium',
  XHR: 'XHR'
};
Object.freeze(HttpAdapter);

var Http = function () {
  function Http() {
    var _this = this;

    var adapters = arguments.length <= 0 || arguments[0] === undefined ? [HttpAdapter.Titanium, HttpAdapter.$Http, HttpAdapter.Node, HttpAdapter.XHR] : arguments[0];

    _classCallCheck(this, Http);

    if (!(0, _isArray2.default)(adapters)) {
      adapters = [adapters];
    }

    adapters.some(function (adapter) {
      switch (adapter) {
        case HttpAdapter.$Http:
          if (_$http.$Http.isSupported()) {
            _this.adapter = new _$http.$Http();
            return true;
          }

          break;
        case HttpAdapter.Node:
          if (_node.NodeHttp.isSupported()) {
            _this.adapter = new _node.NodeHttp();
            return true;
          }

          break;
        case HttpAdapter.TitaniumHttp:
          if (_titanium.TitaniumHttp.isSupported()) {
            _this.adapter = new _titanium.TitaniumHttp();
            return true;
          }

          break;
        case HttpAdapter.XHR:
          if (_xhr.XHR.isSupported()) {
            _this.adapter = new _xhr.XHR();
            return true;
          }

          break;
        default:
        // Log.warn(`The ${adapter} adapter is is not recognized.`);
      }

      return false;
    });
  }

  _createClass(Http, [{
    key: 'handle',
    value: function () {
      var _ref = _asyncToGenerator(_regeneratorRuntime2.default.mark(function _callee(request, response) {
        return _regeneratorRuntime2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.adapter) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return', this.adapter.handle(request, response));

              case 2:
                throw new Error('Unable to handle the request. An adapter is not specified.');

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function handle(_x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return handle;
    }()
  }]);

  return Http;
}();

exports.default = Http;