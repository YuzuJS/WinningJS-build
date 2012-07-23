"use strict";

function getStackFrames(error) {
    // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi

    // Replace the `Error.prepareStackTrace` function temporarily, to capture the frames.
    var oldErrorPrepareStackTrace = Error.prepareStackTrace;
    var frames = null;
    Error.prepareStackTrace = function (theError, theFrames) {
        frames = theFrames;
    };

    /*jshint expr: true */
    // Calling the `error.stack` getter triggers our custom `Error.prepareStackTrace` function above.
    error.stack;

    // Clean up after ourselves.
    Error.prepareStackTrace = oldErrorPrepareStackTrace;

    return frames;
}

exports.urlize = function (path) {
    return "/" + path.replace(/\\/g, "/");
};

exports.getVisualStudioBuildErrorMessage = function (error) {
    // http://msdn.microsoft.com/en-us/library/yxkt8b26%28v=vs.110%29.aspx

    var frames = getStackFrames(error);

    // Since we only have room for one line in the error window, pick the top stack frame for
    // file name/line number/column number.
    var fileName = frames[0].getFileName();
    var line = frames[0].getLineNumber();
    var column = frames[0].getColumnNumber();
    var code = error.name;
    var message = error.message;

    return fileName + "(" + line + "," + column + "): error " + code + ": " + message;
};
