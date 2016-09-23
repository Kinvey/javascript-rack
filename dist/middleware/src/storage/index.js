'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // eslint-disable-line no-unused-vars


var _errors = require('../../../errors');

var _webstorage = require('./src/webstorage');

var _indexeddb = require('./src/indexeddb');

var _indexeddb2 = _interopRequireDefault(_indexeddb);

var _websql = require('./src/websql');

var _websql2 = _interopRequireDefault(_websql);

var _titaniumdb = require('./src/titaniumdb');

var _titaniumdb2 = _interopRequireDefault(_titaniumdb);

var _memory = require('./src/memory');

var _memory2 = _interopRequireDefault(_memory);

var _promise = require('core-js/es6/promise');

var _promise2 = _interopRequireDefault(_promise);

var _promiseQueue = require('promise-queue');

var _promiseQueue2 = _interopRequireDefault(_promiseQueue);

var _regeneratorRuntime = require('regenerator-runtime');

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _promise2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _promise2.default.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var idAttribute = process && process.env && process.env.KINVEY_ID_ATTRIBUTE || undefined || '_id';
var kmdAttribute = process && process.env && process.env.KINVEY_KMD_ATTRIBUTE || undefined || '_kmd';
_promiseQueue2.default.configure(_promise2.default);
var queue = new _promiseQueue2.default(1, Infinity);

/**
 * Enum for Storage Adapters.
 */
var StorageAdapter = {
  IndexedDB: 'IndexedDB',
  LocalStorage: 'LocalStorage',
  Memory: 'Memory',
  SessionStorage: 'SessionStorage',
  TitaniumDB: 'TitaniumDB',
  WebSQL: 'WebSQL'
};
Object.freeze(StorageAdapter);

var Storage = function () {
  function Storage(name) {
    var _this = this;

    var adapters = arguments.length <= 1 || arguments[1] === undefined ? [StorageAdapter.TitaniumDB, StorageAdapter.WebSQL, StorageAdapter.IndexedDB, StorageAdapter.LocalStorage, StorageAdapter.SessionStorage, StorageAdapter.Memory] : arguments[1];

    _classCallCheck(this, Storage);

    if (!name) {
      throw new Error('Unable to create a Storage instance without a name.');
    }

    if (!(0, _isString2.default)(name)) {
      throw new Error('The name is not a string. A name must be a string to create a Storage instance.');
    }

    if (!(0, _isArray2.default)(adapters)) {
      adapters = [adapters];
    }

    adapters.some(function (adapter) {
      switch (adapter) {
        case StorageAdapter.IndexedDB:
          if (_indexeddb2.default.isSupported()) {
            _this.adapter = new _indexeddb2.default(name);
            return true;
          }

          break;
        case StorageAdapter.LocalStorage:
          if (_webstorage.LocalStorage.isSupported()) {
            _this.adapter = new _webstorage.LocalStorage(name);
            return true;
          }

          break;
        case StorageAdapter.SessionStorage:
          if (_webstorage.SessionStorage.isSupported()) {
            _this.adapter = new _webstorage.SessionStorage(name);
            return true;
          }

          break;
        case StorageAdapter.TitaniumDB:
          if (_titaniumdb2.default.isSupported()) {
            _this.adapter = new _titaniumdb2.default(name);
            return true;
          }

          break;
        case StorageAdapter.WebSQL:
          if (_websql2.default.isSupported()) {
            _this.adapter = new _websql2.default(name);
            return true;
          }

          break;
        case StorageAdapter.Memory:
          if (_memory2.default.isSupported()) {
            _this.adapter = new _memory2.default(name);
            return true;
          }

          break;
        default:
        // Log.warn(`The ${adapter} adapter is is not recognized.`);
      }

      return false;
    });
  }

  _createClass(Storage, [{
    key: 'generateObjectId',
    value: function generateObjectId() {
      var length = arguments.length <= 0 || arguments[0] === undefined ? 24 : arguments[0];

      var chars = 'abcdef0123456789';
      var objectId = '';

      for (var i = 0, j = chars.length; i < length; i += 1) {
        var pos = Math.floor(Math.random() * j);
        objectId += chars.substring(pos, pos + 1);
      }

      return objectId;
    }
  }, {
    key: 'find',
    value: function () {
      var _ref = _asyncToGenerator(_regeneratorRuntime2.default.mark(function _callee(collection) {
        var entities;
        return _regeneratorRuntime2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this.adapter.find(collection);

              case 3:
                entities = _context.sent;

                if (entities) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt('return', []);

              case 6:
                return _context.abrupt('return', entities);

              case 9:
                _context.prev = 9;
                _context.t0 = _context['catch'](0);

                if (!(_context.t0 instanceof _errors.NotFoundError)) {
                  _context.next = 13;
                  break;
                }

                return _context.abrupt('return', []);

              case 13:
                throw _context.t0;

              case 14:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 9]]);
      }));

      function find(_x3) {
        return _ref.apply(this, arguments);
      }

      return find;
    }()
  }, {
    key: 'findById',
    value: function () {
      var _ref2 = _asyncToGenerator(_regeneratorRuntime2.default.mark(function _callee2(collection, id) {
        return _regeneratorRuntime2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if ((0, _isString2.default)(id)) {
                  _context2.next = 2;
                  break;
                }

                throw new Error('id must be a string', id);

              case 2:
                return _context2.abrupt('return', this.adapter.findById(collection, id));

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function findById(_x4, _x5) {
        return _ref2.apply(this, arguments);
      }

      return findById;
    }()

    // async group(collection, aggregation) {
    //   const entities = await this.find(collection);

    //   if (!(aggregation instanceof Aggregation)) {
    //     aggregation = new Aggregation(result(aggregation, 'toJSON', aggregation));
    //   }

    //   if (entities.length > 0 && aggregation) {
    //     return aggregation.process(entities);
    //   }

    //   return null;
    // }

  }, {
    key: 'save',
    value: function save(collection) {
      var _this2 = this;

      var entities = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

      return queue.add(_asyncToGenerator(_regeneratorRuntime2.default.mark(function _callee3() {
        var singular;
        return _regeneratorRuntime2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                singular = false;

                if (entities) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt('return', null);

              case 3:

                if (!(0, _isArray2.default)(entities)) {
                  singular = true;
                  entities = [entities];
                }

                entities = entities.map(function (entity) {
                  var id = entity[idAttribute];
                  var kmd = entity[kmdAttribute] || {};

                  if (!id) {
                    id = _this2.generateObjectId();
                    kmd.local = true;
                  }

                  entity[idAttribute] = id;
                  entity[kmdAttribute] = kmd;
                  return entity;
                });

                _context3.next = 7;
                return _this2.adapter.save(collection, entities);

              case 7:
                entities = _context3.sent;

                if (!(singular && entities.length > 0)) {
                  _context3.next = 10;
                  break;
                }

                return _context3.abrupt('return', entities[0]);

              case 10:
                return _context3.abrupt('return', entities);

              case 11:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, _this2);
      })));
    }
  }, {
    key: 'remove',
    value: function () {
      var _ref4 = _asyncToGenerator(_regeneratorRuntime2.default.mark(function _callee4(collection) {
        var _this3 = this;

        var entities = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
        var responses;
        return _regeneratorRuntime2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _promise2.default.all(entities.map(function (entity) {
                  return _this3.removeById(collection, entity[idAttribute]);
                }));

              case 2:
                responses = _context4.sent;
                return _context4.abrupt('return', responses.reduce(function (entities, entity) {
                  entities.push(entity);
                  return entities;
                }, []));

              case 4:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function remove(_x7, _x8) {
        return _ref4.apply(this, arguments);
      }

      return remove;
    }()
  }, {
    key: 'removeById',
    value: function removeById(collection, id) {
      var _this4 = this;

      return queue.add(function () {
        if (!id) {
          return undefined;
        }

        if (!(0, _isString2.default)(id)) {
          throw new Error('id must be a string', id);
        }

        return _this4.adapter.removeById(collection, id);
      });
    }
  }, {
    key: 'clear',
    value: function clear() {
      var _this5 = this;

      return queue.add(function () {
        return _this5.adapter.clear();
      });
    }
  }]);

  return Storage;
}();

exports.default = Storage;