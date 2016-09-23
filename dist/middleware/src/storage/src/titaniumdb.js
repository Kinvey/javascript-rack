'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // eslint-disable-line no-unused-vars


var _errors = require('../../../../errors');

var _regeneratorRuntime = require('regenerator-runtime');

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Titanium = global.Titanium;
var idAttribute = process && process.env && process.env.KINVEY_ID_ATTRIBUTE || undefined || '_id';

var TitaniumDB = function () {
  function TitaniumDB() {
    var name = arguments.length <= 0 || arguments[0] === undefined ? 'kinvey' : arguments[0];

    _classCallCheck(this, TitaniumDB);

    this.name = name;
  }

  _createClass(TitaniumDB, [{
    key: 'execute',
    value: function () {
      var _ref = _asyncToGenerator(_regeneratorRuntime2.default.mark(function _callee(collection, query, parameters) {
        var _this = this;

        var escapedCollection, isMulti, response;
        return _regeneratorRuntime2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                escapedCollection = '"' + collection + '"';
                isMulti = (0, _isArray2.default)(query);

                query = isMulti ? query : [[query, parameters]];

                _context.prev = 3;

                if (!this.db) {
                  this.db = Titanium.Database.open(this.name);
                }

                // Start a transaction
                this.db.execute('BEGIN TRANSACTION');

                // Create the table if it does not exist yet
                this.db.execute('CREATE TABLE IF NOT EXISTS ' + escapedCollection + ' ' + '(key BLOB PRIMARY KEY NOT NULL, value BLOB NOT NULL)');

                // Execute queries
                response = (0, _map2.default)(query, function (parts) {
                  var sql = parts[0].replace('#{collection}', escapedCollection);
                  var cursor = _this.db.execute(sql, parts[1]);
                  var response = { rowCount: _this.db.getRowsAffected(), result: null };

                  if (cursor) {
                    response.result = [];

                    while (cursor.isValidRow()) {
                      var entity = JSON.parse(cursor.fieldByName('value'));
                      response.result.push(entity);
                      cursor.next();
                    }

                    cursor.close();
                  }

                  return response;
                });

                // Commit the transaction

                this.db.execute('COMMIT TRANSACTION');

                return _context.abrupt('return', isMulti ? response : response.shift());

              case 12:
                _context.prev = 12;
                _context.t0 = _context['catch'](3);
                throw new Error(_context.t0.message);

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 12]]);
      }));

      function execute(_x2, _x3, _x4) {
        return _ref.apply(this, arguments);
      }

      return execute;
    }()
  }, {
    key: 'find',
    value: function find(collection) {
      var sql = 'SELECT value FROM #{collection}';
      var promise = this.execute(collection, sql, []).then(function (response) {
        return response.result;
      }).catch(function (error) {
        if (error instanceof _errors.NotFoundError) {
          return [];
        }

        throw error;
      });
      return promise;
    }
  }, {
    key: 'findById',
    value: function findById(collection, id) {
      var _this2 = this;

      var sql = 'SELECT value FROM #{collection} WHERE key = ?';
      var promise = this.execute(collection, sql, [id]).then(function (response) {
        var entities = response.result;

        if (entities.length === 0) {
          throw new _errors.NotFoundError('An entity with _id = ' + id + ' was not found in the ' + collection + ' ' + ('collection on the ' + _this2.name + ' webSQL database.'));
        }

        return entities[0];
      });
      return promise;
    }
  }, {
    key: 'save',
    value: function save(collection, entities) {
      var queries = [];
      entities = (0, _map2.default)(entities, function (entity) {
        queries.push(['INSERT OR REPLACE INTO #{collection} (key, value) VALUES (?, ?)', [entity[idAttribute], JSON.stringify(entity)]]);

        return entity;
      });

      var promise = this.execute(collection, queries, null).then(function () {
        return entities;
      });
      return promise;
    }
  }, {
    key: 'removeById',
    value: function removeById(collection, id) {
      var _this3 = this;

      var promise = this.execute(collection, [['SELECT value FROM #{collection} WHERE key = ?', [id]], ['DELETE FROM #{collection} WHERE key = ?', [id]]], null).then(function (response) {
        var entities = response[0].result;
        var count = response[1].rowCount || entities.length;

        if (count === 0) {
          throw new _errors.NotFoundError('An entity with _id = ' + id + ' was not found in the ' + collection + ' ' + ('collection on the ' + _this3.name + ' webSQL database.'));
        }

        return {
          count: 1,
          entities: entities
        };
      });

      return promise;
    }
  }, {
    key: 'clear',
    value: function () {
      var _ref2 = _asyncToGenerator(_regeneratorRuntime2.default.mark(function _callee2() {
        return _regeneratorRuntime2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.db) {
                  this.db = Titanium.Database.open(this.name);
                }

                if (!(0, _isFunction2.default)(this.db.remove)) {
                  _context2.next = 4;
                  break;
                }

                // Android
                this.db.remove();
                return _context2.abrupt('return', null);

              case 4:
                if (!(this.db.file && this.db.file.deleteFile())) {
                  _context2.next = 6;
                  break;
                }

                return _context2.abrupt('return', null);

              case 6:
                throw new Error('The mechanism to delete the database is not implemented for this platform.');

              case 7:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function clear() {
        return _ref2.apply(this, arguments);
      }

      return clear;
    }()
  }], [{
    key: 'isSupported',
    value: function isSupported() {
      return typeof Titanium !== 'undefined' && typeof Titanium.Database !== 'undefined';
    }
  }]);

  return TitaniumDB;
}();

exports.default = TitaniumDB;