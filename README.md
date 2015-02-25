[![Build Status](https://travis-ci.org/gmaclennan/parse-dms.svg)](https://travis-ci.org/gmaclennan/parse-dms)

parseDMS
========

A robust parser for degrees, minutes, seconds latitude and longitude values, with comprehensive tests.

## Demo

[Try it out](http://gmaclennan.github.io/parse-dms) in the browser.

## Usage

```javascript
var parseDMS = require('parse-dms');

parseDMS('59°12\'7.7"N 02°15\'39.6"W')
```

Returns an object with properties `lat` `lon` if it can infer them, or a single number if only one coordinate is provided and it cannot infer lat or lon.

If a DMS coordinate pair is given with no hemisphere letters, then the order is assumed to be lat, lon.

Will throw an error if it cannot parse the string or if degrees, minutes, or seconds are out of range.

Should be able to handle most weird ways that people write DMS values, but if you find one that it cannot handle please submit an issue, or better, submit a pull request with a new test. The regex used is here: https://regex101.com/r/kS2zR1/3

See `test/index.js` for more details on what it can parse.

## Run tests
-----

`npm test`

## Contributing

Pull requests welcome with tests.

## Release History

* 0.0.1 Initial release
