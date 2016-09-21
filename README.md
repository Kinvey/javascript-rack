# Kinvey JavaScript Rack [![Build Status](https://travis-ci.org/Kinvey/javascript-rack.svg?branch=master)](https://travis-ci.org/Kinvey/javascript-rack) [![Code Climate](https://codeclimate.com/github/Kinvey/javascript-rack/badges/gpa.svg)](https://codeclimate.com/github/Kinvey/javascript-rack) [![codecov](https://codecov.io/gh/Kinvey/javascript-rack/branch/master/graph/badge.svg)](https://codecov.io/gh/Kinvey/javascript-rack)
The Kinvey JavaScript Rack provides a minimal, modular, and adaptable interface for developing shims for the Kinvey JavaScript SDK.

## Build
Execute `npm run build` to build the SDK.

## Release
[TravisCI](https://travis-ci.org/Kinvey/javascript-rack) will deploy the pacakge to [NPM](https://www.npmjs.com/package/kinvey-javascript-rack).

1. Checkout the master branch.
2. Update the CHANGELOG.md.
3. Execute `npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]`. See [Version Management](#version-management) for more info on incrementing the version.
4. Done.

### Version Management
Updating the SDK version should follow [Semantic Version 2.0.0](http://semver.org/):

* Major (x.0.0): when making an incompatible API changes.
* Minor (3.x.0): when adding functionality in a backwards-compatible manner.
* Patch (3.0.x): when making backwards-compatible bug fixes or enhancements.

## Test
Execute `npm test` to run the unit tests for the SDK.

## License
See [LICENSE](LICENSE) for details.

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for details on reporting bugs and making contributions.
