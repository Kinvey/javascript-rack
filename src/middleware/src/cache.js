import { NotFoundError } from '../../errors';
import Middleware from './middleware';
import Storage from './storage';
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars
import isEmpty from 'lodash/isEmpty';

export default class CacheMiddleware extends Middleware {
  constructor(name = 'Cache Middleware') {
    super(name);
  }

  async handle(request) {
    const { method, body, appKey, collection, entityId } = request;
    const storage = new Storage(appKey);
    let data;
    const response = {
      statusCode: method === 'POST' ? 201 : 200,
      headers: {},
      data: data
    };

    try {
      if (method === 'GET') {
        if (entityId) {
          data = await storage.findById(collection, entityId);
        } else {
          data = await storage.find(collection);
        }
      } else if (method === 'POST' || method === 'PUT') {
        data = await storage.save(collection, body);
      } else if (method === 'DELETE') {
        if (collection && entityId) {
          data = await storage.removeById(collection, entityId);
        } else if (!collection) {
          data = await storage.clear();
        } else {
          data = await storage.remove(collection, body);
        }
      }

      response.data = data;

      if (!data || isEmpty(data)) {
        response.statusCode = 204;
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        response.statusCode = 404;
      } else {
        response.statusCode = 500;
      }
    }

    return { response: response };
  }
}
