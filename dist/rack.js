'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NetworkRack = exports.CacheRack = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _regeneratorRuntime = require('regenerator-runtime');

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

var _findIndex = require('lodash/findIndex');

var _findIndex2 = _interopRequireDefault(_findIndex);

var _reduce = require('lodash/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // eslint-disable-line no-unused-vars


var Rack = function (_Middleware) {
  _inherits(Rack, _Middleware);

  function Rack() {
    var name = arguments.length <= 0 || arguments[0] === undefined ? 'Rack' : arguments[0];

    _classCallCheck(this, Rack);

    var _this = _possibleConstructorReturn(this, (Rack.__proto__ || Object.getPrototypeOf(Rack)).call(this, name));

    _this.middlewares = [];
    _this.canceled = false;
    return _this;
  }

  _createClass(Rack, [{
    key: 'getMiddleware',
    value: function getMiddleware() {
      var index = arguments.length <= 0 || arguments[0] === undefined ? -1 : arguments[0];

      var middlewares = this.middlewares;

      if (index < -1 || index >= middlewares.length) {
        throw new Error('Index ' + index + ' is out of bounds.');
      }

      return middlewares[index];
    }
  }, {
    key: 'use',
    value: function use(middleware) {
      if (middleware) {
        if (middleware instanceof _middleware2.default) {
          this.middlewares.push(middleware);
          return;
        }

        throw new Error('Unable to use the middleware. It must be an instance of Middleware.');
      }
    }
  }, {
    key: 'useBefore',
    value: function useBefore(middlewareClass, middleware) {
      if (middleware) {
        if (middleware instanceof _middleware2.default) {
          var middlewares = this.middlewares;
          var index = (0, _findIndex2.default)(middlewares, function (existingMiddleware) {
            return existingMiddleware instanceof middlewareClass;
          });

          if (index > -1) {
            middlewares.splice(index, 0, middleware);
            this.middlewares = middlewares;
          }

          return;
        }

        throw new Error('Unable to use the middleware. It must be an instance of Middleware.');
      }
    }
  }, {
    key: 'useAfter',
    value: function useAfter(middlewareClass, middleware) {
      if (middleware) {
        if (middleware instanceof _middleware2.default) {
          var middlewares = this.middlewares;
          var index = (0, _findIndex2.default)(middlewares, function (existingMiddleware) {
            return existingMiddleware instanceof middlewareClass;
          });

          if (index > -1) {
            middlewares.splice(index + 1, 0, middleware);
            this.middlewares = middlewares;
          }

          return;
        }

        throw new Error('Unable to use the middleware. It must be an instance of Middleware.');
      }
    }
  }, {
    key: 'swap',
    value: function swap(middlewareClass, middleware) {
      if (middleware) {
        if (middleware instanceof _middleware2.default) {
          var middlewares = this.middlewares;
          var index = (0, _findIndex2.default)(middlewares, function (existingMiddleware) {
            return existingMiddleware instanceof middlewareClass;
          });

          if (index > -1) {
            middlewares.splice(index, 1, middleware);
            this.middlewares = middlewares;
          }

          return;
        }

        throw new Error('Unable to use the middleware. It must be an instance of Middleware.');
      }
    }
  }, {
    key: 'remove',
    value: function remove(middlewareClass) {
      var middlewares = this.middlewares;
      var index = (0, _findIndex2.default)(middlewares, function (existingMiddleware) {
        return existingMiddleware instanceof middlewareClass;
      });

      if (index > -1) {
        middlewares.splice(index, 1);
        this.middlewares = middlewares;
        this.remove(middlewareClass);
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.middlewares = [];
    }
  }, {
    key: 'execute',
    value: function () {
      var _ref = _asyncToGenerator(_regeneratorRuntime2.default.mark(function _callee(req) {
        var _ref2, response;

        return _regeneratorRuntime2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (req) {
                  _context.next = 2;
                  break;
                }

                throw new Error('Request is undefined. Please provide a valid request.');

              case 2:
                _context.next = 4;
                return (0, _reduce2.default)(this.middlewares, function (promise, middleware) {
                  return promise.then(function (_ref3) {
                    var request = _ref3.request;
                    var response = _ref3.response;
                    return middleware.handle(request || req, response);
                  });
                }, Promise.resolve({ request: req }));

              case 4:
                _ref2 = _context.sent;
                response = _ref2.response;
                return _context.abrupt('return', response);

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function execute(_x3) {
        return _ref.apply(this, arguments);
      }

      return execute;
    }()
  }, {
    key: 'cancel',
    value: function cancel() {
      this.canceled = true;
    }
  }, {
    key: 'handle',
    value: function handle(request) {
      return this.execute(request);
    }
  }, {
    key: 'generateTree',
    value: function generateTree() {
      var level = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      var root = _get(Rack.prototype.__proto__ || Object.getPrototypeOf(Rack.prototype), 'generateTree', this).call(this, level);
      var middlewares = this.middlewares;

      middlewares.forEach(function (middleware) {
        root.nodes.push(middleware.generateTree(level + 1));
      });

      return root;
    }
  }]);

  return Rack;
}(_middleware2.default);

exports.default = Rack;

var CacheRack = exports.CacheRack = function (_Rack) {
  _inherits(CacheRack, _Rack);

  function CacheRack() {
    var name = arguments.length <= 0 || arguments[0] === undefined ? 'Cache Rack' : arguments[0];

    _classCallCheck(this, CacheRack);

    var _this2 = _possibleConstructorReturn(this, (CacheRack.__proto__ || Object.getPrototypeOf(CacheRack)).call(this, name));

    _this2.use(new _middleware.CacheMiddleware());
    return _this2;
  }

  return CacheRack;
}(Rack);

var NetworkRack = exports.NetworkRack = function (_Rack2) {
  _inherits(NetworkRack, _Rack2);

  function NetworkRack() {
    var name = arguments.length <= 0 || arguments[0] === undefined ? 'Network Rack' : arguments[0];

    _classCallCheck(this, NetworkRack);

    var _this3 = _possibleConstructorReturn(this, (NetworkRack.__proto__ || Object.getPrototypeOf(NetworkRack)).call(this, name));

    _this3.use(new _middleware.SerializeMiddleware());
    _this3.use(new _middleware.HttpMiddleware());
    _this3.use(new _middleware.ParseMiddleware());
    return _this3;
  }

  return NetworkRack;
}(Rack);