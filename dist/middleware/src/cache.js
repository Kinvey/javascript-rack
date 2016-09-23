'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _errors = require('../../errors');

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _storage = require('./storage');

var _storage2 = _interopRequireDefault(_storage);

var _regeneratorRuntime = require('regenerator-runtime');

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // eslint-disable-line no-unused-vars


var CacheMiddleware = function (_Middleware) {
  _inherits(CacheMiddleware, _Middleware);

  function CacheMiddleware() {
    var name = arguments.length <= 0 || arguments[0] === undefined ? 'Cache Middleware' : arguments[0];

    _classCallCheck(this, CacheMiddleware);

    return _possibleConstructorReturn(this, (CacheMiddleware.__proto__ || Object.getPrototypeOf(CacheMiddleware)).call(this, name));
  }

  _createClass(CacheMiddleware, [{
    key: 'handle',
    value: function () {
      var _ref = _asyncToGenerator(_regeneratorRuntime2.default.mark(function _callee(request) {
        var method, body, appKey, collection, entityId, storage, data, response;
        return _regeneratorRuntime2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                method = request.method;
                body = request.body;
                appKey = request.appKey;
                collection = request.collection;
                entityId = request.entityId;
                storage = new _storage2.default(appKey);
                data = void 0;
                response = {
                  statusCode: method === 'POST' ? 201 : 200,
                  headers: {},
                  data: data
                };
                _context.prev = 8;

                if (!(method === 'GET')) {
                  _context.next = 21;
                  break;
                }

                if (!entityId) {
                  _context.next = 16;
                  break;
                }

                _context.next = 13;
                return storage.findById(collection, entityId);

              case 13:
                data = _context.sent;
                _context.next = 19;
                break;

              case 16:
                _context.next = 18;
                return storage.find(collection);

              case 18:
                data = _context.sent;

              case 19:
                _context.next = 43;
                break;

              case 21:
                if (!(method === 'POST' || method === 'PUT')) {
                  _context.next = 27;
                  break;
                }

                _context.next = 24;
                return storage.save(collection, body);

              case 24:
                data = _context.sent;
                _context.next = 43;
                break;

              case 27:
                if (!(method === 'DELETE')) {
                  _context.next = 43;
                  break;
                }

                if (!(collection && entityId)) {
                  _context.next = 34;
                  break;
                }

                _context.next = 31;
                return storage.removeById(collection, entityId);

              case 31:
                data = _context.sent;
                _context.next = 43;
                break;

              case 34:
                if (collection) {
                  _context.next = 40;
                  break;
                }

                _context.next = 37;
                return storage.clear();

              case 37:
                data = _context.sent;
                _context.next = 43;
                break;

              case 40:
                _context.next = 42;
                return storage.remove(collection, body);

              case 42:
                data = _context.sent;

              case 43:

                response.data = data;

                if (!data || (0, _isEmpty2.default)(data)) {
                  response.statusCode = 204;
                }
                _context.next = 50;
                break;

              case 47:
                _context.prev = 47;
                _context.t0 = _context['catch'](8);

                if (_context.t0 instanceof _errors.NotFoundError) {
                  response.statusCode = 404;
                } else {
                  response.statusCode = 500;
                }

              case 50:
                return _context.abrupt('return', { response: response });

              case 51:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[8, 47]]);
      }));

      function handle(_x2) {
        return _ref.apply(this, arguments);
      }

      return handle;
    }()
  }]);

  return CacheMiddleware;
}(_middleware2.default);

exports.default = CacheMiddleware;