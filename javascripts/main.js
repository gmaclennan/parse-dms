var $ = require('jquery');
var parseDMS = require('parse-dms');

$('#dms').keyup(function() {
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
});
