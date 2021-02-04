var test = require('tape');
var parseDms = require('../');

test('Correctly parses DMS pairs with different separators, hemisphere at end', function(t) {

    var testData = [
        '59°12\'7.7"N 02°15\'39.6"W',
        '59º12\'7.7"N 02º15\'39.6"W',
        '59 12\' 7.7" N 02 15\' 39.6" W',
        '59 12\'7.7\'\'N 02 15\'39.6\'\' W',
        '59:12:7.7"N 2:15:39.6W',
        '59 12’7.7’’N 02 15’39.6’’W'
    ];

    var expected = {
        lat: 59 + 12 / 60 + 7.7 / 3600,
        lon: -1 * (2 + 15 / 60 + 39.6 / 3600)
    };

    for (var i = 0; i < testData.length; i ++) {
        t.deepEqual(parseDms(testData[i]), expected, testData[i]);
    }
    
    t.end();
});

test('Correctly parses DMS pairs with hemisphere at beginning', function(t) {

    var testData = [
        'N59°12\'7.7" W02°15\'39.6"',
        'N 59°12\'7.7" W 02°15\'39.6"',
        'N 59.20213888888889° W 2.261°',
        'N 59.20213888888889 W 2.261',
        'W02°15\'39.6" N59°12\'7.7"'
    ];

    var expected = {
        lat: 59 + 12 / 60 + 7.7 / 3600,
        lon: -1 * (2 + 15 / 60 + 39.6 / 3600)
    };

    for (var i = 0; i < testData.length; i ++) {
        t.deepEqual(parseDms(testData[i]), expected, testData[i]);
    }

    t.end();
});

test('Correctly parses different separators between lat / lon pairs', function(t) {

    var testData = [
        '59°12\'7.7"N  02°15\'39.6"W',
        '59°12\'7.7"N , 02°15\'39.6"W',
        '59°12\'7.7"N,02°15\'39.6"W'
    ];

    var expected = {
        lat: 59 + 12 / 60 + 7.7 / 3600,
        lon: -1 * (2 + 15 / 60 + 39.6 / 3600)
    };

    for (var i = 0; i < testData.length; i ++) {
        t.deepEqual(parseDms(testData[i]), expected, testData[i]);
    }

    t.end();
});

test('Will parse a single coordinate with hemisphere', function(t) {

    var testData = [
        '59°12\'7.7"N',
        '02°15\'39.6"W'
    ];

    var expected = [
        {
            lat: 59 + 12 / 60 + 7.7 / 3600,
            lon: undefined
        },{
            lat: undefined,
            lon: -1 * (2 + 15 / 60 + 39.6 / 3600)
        }
    ];


    for (var i = 0; i < testData.length; i ++) {
        t.deepEqual(parseDms(testData[i]), expected[i], testData[i]);
    }

    t.end();
});

test('Will parse a single coordinate with no hemisphere and return a number', function(t) {

    var testData = [
        '59°12\'7.7"',
        '02°15\'39.6"',
        '-02°15\'39.6"'
    ];

    var expected = [
        59 + 12 / 60 + 7.7 / 3600,
        2 + 15 / 60 + 39.6 / 3600,
        -1 * (2 + 15 / 60 + 39.6 / 3600)
    ];


    for (var i = 0; i < testData.length; i ++) {
        t.deepEqual(parseDms(testData[i]), expected[i], testData[i]);
    }

    t.end();

});

test('Will infer first coordinate is lat, second lon, if no hemisphere letter is included', function(t) {

    var testData = [
        '59°12\'7.7" -02°15\'39.6"',
        '59°12\'7.7", -02°15\'39.6"',
    ];

    var expected = {
        lat: 59 + 12 / 60 + 7.7 / 3600,
        lon: -1 * (2 + 15 / 60 + 39.6 / 3600)
    };

    for (var i = 0; i < testData.length; i ++) {
        t.deepEqual(parseDms(testData[i]), expected, testData[i]);
    }

    t.end();

});

test('throws an error for invalid data', function(t) {

    var testData = [
        'Not DMS string'
    ];

    for (var i = 0; i < testData.length; i ++) {
        t.throws(parseDms.bind(null, testData[i]), /Could not parse string/, "Throws for '" + testData[i] + "'");
    }

    t.end();
});

test('Throws for degrees out of range', function(t) {
    t.throws(parseDms.bind(null, '190°12\'7.7" -02°15\'39.6"'), /Degrees out of range/);
    t.end();
});

test('Throws for minutes out of range', function(t) {
    t.throws(parseDms.bind(null, '59°65\'7.7" -02°15\'39.6"'), /Minutes out of range/);
    t.end();
});

test('Throws for seconds out of range', function(t) {
    t.throws(parseDms.bind(null, '59°12\'65.5" -02°15\'39.6"'), /Seconds out of range/);
    t.end();
});

test('Correctly parses DMS with decimal minutes', function(t) {

    var testData = [
        'N59°12.105\' W02°15.66\'',
        'N59:12.105\' W02:15.66\'',
        'N59:12.105 W02:15.66',
        '59:12.105\'N 02:15.66\'W'
    ];

    var expected = {
        lat: 59 + 12.105 / 60,
        lon: -1 * (2 + 15.66 / 60)
    };

    for (var i = 0; i < testData.length; i ++) {
        t.deepEqual(parseDms(testData[i]), expected, testData[i]);
    }

    t.end();
});

test('Correctly parses DMS with no minutes or seconds', function(t) {

    var testData = [
        '59°N 02°W'
    ];

    var expected = {
        lat: 59,
        lon: -2
    };

    for (var i = 0; i < testData.length; i ++) {
        t.deepEqual(parseDms(testData[i]), expected, testData[i]);
    }

    t.end();
});

test('Parse decimal degrees as decimal degrees', function(t) {

    var testData = [
        '51.5, -0.126',
        '51.5,-0.126',
        '51.5 -0.126'
    ];

    var expected = {
        lat: 51.5,
        lon: -0.126
    };

    for (var i = 0; i < testData.length; i ++) {
        t.deepEqual(parseDms(testData[i]), expected, testData[i]);
    }

    t.end();
});

test('Parse DMS with separators and spaces', function(t) {

    var testData = [
        '59° 12\' 7.7" N 02° 15\' 39.6" W',
        '59º 12\' 7.7" N 02º 15\' 39.6" W',
        '59 12’ 7.7’’N 02 15’ 39.6’’W'
    ];

    var expected = {
        lat: 59 + 12 / 60 + 7.7 / 3600,
        lon: -1 * (2 + 15 / 60 + 39.6 / 3600)
    };

    for (var i = 0; i < testData.length; i ++) {
        t.deepEqual(parseDms(testData[i]), expected, testData[i]);
    }
    
    t.end();
});
