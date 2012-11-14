"use strict";

var path = require("path");
var jade = require("jade");
var doBrowserify = require("./doBrowserify");
var doStylus = require("./doStylus");
var getVisualStudioBuildErrorMessage = require("./utils").getVisualStudioBuildErrorMessage;

module.exports = function (grunt) {
    function writeIndex(src, dest, jadeLocals) {
        var jadeFile = grunt.file.read(src);
        var templateFunction = jade.compile(jadeFile, { filename: src, compileDebug: false, pretty: true });
        var indexHtml = templateFunction(jadeLocals);
        grunt.file.write(dest, indexHtml);
        grunt.log.writeln("Main HTML file created at \"" + dest + "\".");
    }

    function doTask() {
        var browserifyConfig = grunt.config("winningJS.browserify");
        var scripts = doBrowserify(grunt, browserifyConfig);

        var stylusConfig = grunt.config("winningJS.stylus");
        var styles = doStylus(grunt, stylusConfig);

        var indexConfig = grunt.config("winningJS");
        indexConfig.src = indexConfig.src ? path.normalize(indexConfig.src) : "index.jade";
        indexConfig.dest = indexConfig.dest ? path.normalize(indexConfig.dest) : "index.html";

        writeIndex(indexConfig.src, indexConfig.dest, { scripts: scripts, styles: styles });
    }

    grunt.registerTask("winningJS", "Browserify modules, compile Stylus, and build an index.html.", function () {
        var done = this.async();

        try {
            doTask();
        } catch (error) {
            console.error(getVisualStudioBuildErrorMessage(error));
        } finally {
            // For some reason the errors don't make it to the UI unless you delay for a bit.
            setTimeout(done, 10);
        }
    });
};
