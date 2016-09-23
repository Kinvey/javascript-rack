import { NotFoundError } from '../../../errors';
import { LocalStorage, SessionStorage } from './src/webstorage';
import IndexedDB from './src/indexeddb';
import WebSQL from './src/websql';
import TitaniumDB from './src/titaniumdb';
import Memory from './src/memory';
import Promise from 'core-js/es6/promise';
import Queue from 'promise-queue';
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
const idAttribute = process.env.KINVEY_ID_ATTRIBUTE || '_id';
const kmdAttribute = process.env.KINVEY_KMD_ATTRIBUTE || '_kmd';
Queue.configure(Promise);
const queue = new Queue(1, Infinity);

/**
 * Enum for Storage Adapters.
 */
const StorageAdapter = {
  IndexedDB: 'IndexedDB',
  LocalStorage: 'LocalStorage',
  Memory: 'Memory',
  SessionStorage: 'SessionStorage',
  TitaniumDB: 'TitaniumDB',
  WebSQL: 'WebSQL'
};
Object.freeze(StorageAdapter);

export default class Storage {
  constructor(name, adapters = [
    StorageAdapter.TitaniumDB,
    StorageAdapter.WebSQL,
    StorageAdapter.IndexedDB,
    StorageAdapter.LocalStorage,
    StorageAdapter.SessionStorage,
    StorageAdapter.Memory
  ]) {
    if (!name) {
      throw new Error('Unable to create a Storage instance without a name.');
    }

    if (!isString(name)) {
      throw new Error('The name is not a string. A name must be a string to create a Storage instance.');
    }

    if (!isArray(adapters)) {
      adapters = [adapters];
    }

    adapters.some((adapter) => {
      switch (adapter) {
        case StorageAdapter.IndexedDB:
          if (IndexedDB.isSupported()) {
            this.adapter = new IndexedDB(name);
            return true;
          }

          break;
        case StorageAdapter.LocalStorage:
          if (LocalStorage.isSupported()) {
            this.adapter = new LocalStorage(name);
            return true;
          }

          break;
        case StorageAdapter.SessionStorage:
          if (SessionStorage.isSupported()) {
            this.adapter = new SessionStorage(name);
            return true;
          }

          break;
        case StorageAdapter.TitaniumDB:
          if (TitaniumDB.isSupported()) {
            this.adapter = new TitaniumDB(name);
            return true;
          }

          break;
        case StorageAdapter.WebSQL:
          if (WebSQL.isSupported()) {
            this.adapter = new WebSQL(name);
            return true;
          }

          break;
        case StorageAdapter.Memory:
          if (Memory.isSupported()) {
            this.adapter = new Memory(name);
            return true;
          }

          break;
        default:
          // Log.warn(`The ${adapter} adapter is is not recognized.`);
      }

      return false;
    });
  }

  generateObjectId(length = 24) {
    const chars = 'abcdef0123456789';
    let objectId = '';

    for (let i = 0, j = chars.length; i < length; i += 1) {
      const pos = Math.floor(Math.random() * j);
      objectId += chars.substring(pos, pos + 1);
    }

    return objectId;
  }

  async find(collection) {
    try {
      const entities = await this.adapter.find(collection);

      if (!entities) {
        return [];
      }

      return entities;
    } catch (error) {
      if (error instanceof NotFoundError) {
        return [];
      }

      throw error;
    }
  }

  async findById(collection, id) {
    if (!isString(id)) {
      throw new Error('id must be a string', id);
    }

    return this.adapter.findById(collection, id);
  }

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

  save(collection, entities = []) {
    return queue.add(async () => {
      let singular = false;

      if (!entities) {
        return null;
      }

      if (!isArray(entities)) {
        singular = true;
        entities = [entities];
      }

      entities = entities.map((entity) => {
        let id = entity[idAttribute];
        const kmd = entity[kmdAttribute] || {};

        if (!id) {
          id = this.generateObjectId();
          kmd.local = true;
        }

        entity[idAttribute] = id;
        entity[kmdAttribute] = kmd;
        return entity;
      });

      entities = await this.adapter.save(collection, entities);

      if (singular && entities.length > 0) {
        return entities[0];
      }

      return entities;
    });
  }

  async remove(collection, entities = []) {
    const responses = await Promise.all(entities.map(entity => this.removeById(collection, entity[idAttribute])));
    return responses.reduce((entities, entity) => {
      entities.push(entity);
      return entities;
    }, []);
  }

  removeById(collection, id) {
    return queue.add(() => {
      if (!id) {
        return undefined;
      }

      if (!isString(id)) {
        throw new Error('id must be a string', id);
      }

      return this.adapter.removeById(collection, id);
    });
  }

  clear() {
    return queue.add(() => this.adapter.clear());
  }
}
