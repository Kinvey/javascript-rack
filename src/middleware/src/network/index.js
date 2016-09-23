import { $Http } from './src/$http';
import { NodeHttp } from './src/node';
import { TitaniumHttp } from './src/titanium';
import { XHR } from './src/xhr';
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars
import isArray from 'lodash/isArray';

/**
 * Enum for Http Adapters.
 */
const HttpAdapter = {
  $Http: '$Http',
  Node: 'Node',
  Titanium: 'Titanium',
  XHR: 'XHR'
};
Object.freeze(HttpAdapter);

export default class Http {
  constructor(adapters = [
    HttpAdapter.Titanium,
    HttpAdapter.$Http,
    HttpAdapter.Node,
    HttpAdapter.XHR
  ]) {
    if (!isArray(adapters)) {
      adapters = [adapters];
    }

    adapters.some((adapter) => {
      switch (adapter) {
        case HttpAdapter.$Http:
          if ($Http.isSupported()) {
            this.adapter = new $Http();
            return true;
          }

          break;
        case HttpAdapter.Node:
          if (NodeHttp.isSupported()) {
            this.adapter = new NodeHttp();
            return true;
          }

          break;
        case HttpAdapter.TitaniumHttp:
          if (TitaniumHttp.isSupported()) {
            this.adapter = new TitaniumHttp();
            return true;
          }

          break;
        case HttpAdapter.XHR:
          if (XHR.isSupported()) {
            this.adapter = new XHR();
            return true;
          }

          break;
        default:
          // Log.warn(`The ${adapter} adapter is is not recognized.`);
      }

      return false;
    });
  }

  async handle(request, response) {
    if (this.adapter) {
      return this.adapter.handle(request, response);
    }

    throw new Error('Unable to handle the request. An adapter is not specified.');
  }
}
