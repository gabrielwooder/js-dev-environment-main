const config = require("../widget.config");

const { method } = config;

var childProcess = require('child_process');

function runScript(scriptPath, callback) {
    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = childProcess.fork(scriptPath);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });
}

// Depending on the method set in the widget config call teh relevant script
if ( method === 'record' ) {
    runScript('./scripts/insert-record.js', function (err) {
        if (err) throw err;
    });
} else if( method === 'insertText' ) {
    runScript('./scripts/insert-text.js', function (err) {
        if (err) throw err;
    });
}