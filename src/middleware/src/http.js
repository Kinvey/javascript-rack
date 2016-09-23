import Middleware from './middleware';
import Http from './network';
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars

export default class HttpMiddleware extends Middleware {
  constructor(name = 'Http Middleware') {
    super(name);
  }

  async handle(request, response) {
    const http = new Http();
    return http.handle(request, response);
  }
}
