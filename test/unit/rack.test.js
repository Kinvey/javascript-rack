import Rack from '../../src/rack';
import Middleware from '../../src/middleware';
import expect from 'expect';

describe('Rack', function () {
  describe('use()', function() {
    it('should push a middleware onto the rack', function() {
      const middleware = new Middleware();
      const rack = new Rack();
      rack.use(middleware);
      expect(rack.middlewares).toEqual([middleware]);
    });
  });
});
