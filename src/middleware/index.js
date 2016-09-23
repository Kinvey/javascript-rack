import CacheMiddleware from './src/cache';
import Middleware from './src/middleware';
import HttpMiddleware from './src/http';
import ParseMiddleware from './src/parse';
import SerializeMiddleware from './src/serialize';

// Export
export {
  CacheMiddleware,
  HttpMiddleware,
  ParseMiddleware,
  SerializeMiddleware
};

// Export default
export default Middleware;
