var $ = require('jquery');
var parseDMS = require('parse-dms');
var csv2geojson = require('csv2geojson');
var tokml = require('tokml');

var mimeTypes = {
    csv: 'text/csv',
    geojson: 'application/json',
    kml: 'application/vnd.google-earth.kml+xml'
};

$('#dms')
    .keyup(onKeyup)
    .focus(onFocus)
    .focus()
    .trigger("keyup");

$('#dec')
    .focus(onFocus);

function onKeyup() {
    var input = this.value.split('\n'),
        output = [],
        errors = [],
        coords;

    $(this).parent().removeClass('has-error');
    $('#error-msg').addClass('hidden');

    for (var i = 0; i < input.length; i++) {
        if (input[i].trim() === "") continue;
        try {
            coords = parseDMS(input[i]);
            output.push(coords.lat + "," + coords.lon);
        } catch (e) {
            errors.push(input[i]);
        }
    }

    $('#dec').val(output.join('\n'));

    if (errors.length) {
        var msg = '<b>Warning:</b> Could not parse input values "' + errors.join('", "') + '"';
        $(this).parent().addClass('has-error');
        $('#error-msg').removeClass('hidden').html(msg);
    }

    if (output.length) {
        $("#download-links").removeClass('hidden');

        var downloads = {};

        downloads.csv = "lat,lon\n" + output.join('\n');

        csv2geojson.csv2geojson(downloads.csv, function(err, data) {
            if (err) downloads['geojson-points'] = "";
            downloads['geojson-points'] = data;
        });

        downloads['geojson-line'] = csv2geojson.toLine(downloads['geojson-points']);
        downloads['geojson-polygon'] = csv2geojson.toPolygon(downloads['geojson-points']);

        downloads['kml-points'] = tokml(downloads['geojson-points']);
        downloads['kml-line'] = tokml(downloads['geojson-line']);
        downloads['kml-polygon'] = tokml(downloads['geojson-polygon']);

        for (var prop in downloads) {
            var type = prop.split('-')[0];

            var content = type === 'geojson' ? JSON.stringify(downloads[prop]) : downloads[prop];

            $('#' + prop + '-download')
                .attr('href','data:' + mimeTypes[type] + ';charset=utf8,' + encodeURIComponent(content));
        }
    } else {
        $('#download-links').addClass('hidden');
    }
}

function onFocus() {
    $(this).select();
}
