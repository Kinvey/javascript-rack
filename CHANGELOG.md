# Change Log

## [v1.2.0](https://github.com/Kinvey/javascript-rack/tree/v1.2.0) (2016-09-23)
[Full Changelog](https://github.com/Kinvey/javascript-rack/compare/1.1.0...1.2.0)

**Implemented enhancements:**

- Added a `CacheMiddleware` for storing data in IndexedDB, WebSQL, LocalStorage, SessionStorage, TitaniumDB, or Memory.
- Added a `SerializeMiddleware` for serializing network data.
- Added a `ParseMiddleware` for parsing network data.
- Added a `HttpMiddleware` for sending http requests in HTML5, NodeJS, Titanium, PhoneGap, and Angular environments.
- Created a default `CacheRack` and `NetworkRack`.

## [v1.1.0](https://github.com/Kinvey/javascript-rack/tree/v1.1.0) (2016-09-21)
[Full Changelog](https://github.com/Kinvey/javascript-rack/compare/1.0.1...1.1.0)

**Implemented enhancements:**

- Added files to integrate [TravisCI](https://travis-ci.org/Kinvey/javascript-rack), [CodeClimate](https://codeclimate.com/github/Kinvey/javascript-rack), and [CodeCov](https://codecov.io/gh/Kinvey/javascript-rack).

**Fixed bugs:**

- Renamed `src/asciiTree.js` to `src/asciitree.js` to prevent build errors on case insensitive operating systems.
- Fixed lint errors in `src/asciitree.js`.

## [v1.0.1](https://github.com/Kinvey/javascript-rack/tree/v1.0.1) (2016-09-09)
