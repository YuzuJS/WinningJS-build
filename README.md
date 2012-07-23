# A Grunt Build Task for WinningJS Applications

Building Windows 8 applications with HTML5 and JavaScript is not a great experience, by default. The "WinJS" framework
has no notion of a module system, and hasn't caught up with the latest and greatest in rapid web development. But it's
2012: nobody wants to code JavaScript using globals and "namespaces," or hand-write their CSS, or even write out verbose
HTML.

The WinningJS framework is meant to help fix the WinJS development experience. And the WinningJS-build package in
particular is meant to modernize the development stack. It is a simple [grunt][] build task which gives:

* A proper module system, via [Browserify][]
* A wonderfully modern CSS replacement with [Stylus][]
* Concise and beautiful HTML templates with [Jade][]

## How to Use

To use this build task, include `WinningJS-build` in your `package.json` and install it. Also, add an `index.jade` file
to your project, using the template variables `scripts`, `entryModule`, and `styles`, like so:

```jade
html
    head
        meta(charset="utf-8")
        title My Awesome Windows 8 App

        //- WinJS references
        link(href="//Microsoft.WinJS.1.0.RC/css/ui-dark.css", rel="stylesheet")
        script(src="//Microsoft.WinJS.1.0.RC/js/base.js")
        script(src="//Microsoft.WinJS.1.0.RC/js/ui.js")

        each script in scripts
            script(src=script)

        script
            require("#{entryModule}");

        each style in styles
            link(href="#{style}", rel="stylesheet")

    body
```

With these in place, you can use the build task inside your root `grunt.js` file, for example like so:

```js
"use strict";

var winningJSBuild = require("WinningJS-build");

module.exports = function (grunt) {
    winningJSBuild(grunt);

    grunt.initConfig({
        winningJS: {
            src: "index.jade",
            dest: "out/index.html",
            browserify: {
                entry: "lib/start",
                dest: "out/browserified",
                aliases: {
                    "jquery": "jquery-browserify"
                }
            },
            stylus: {
                src: ["styles/**/*.styl", "components/**/*.styl"],
                dest: "out/css"
            }
        }
    });

    grunt.registerTask("default", "winningJS");
};
```

In total, this build task will:

* [Browserify][] all modules recursively required by the `winningJS.browserify.entry` module. The results will be
  written, one file at a time (for better debugability), to the `winningJS.browserify.dest` location.
  * Browserify aliases are also supported, through the `winningJS.browserify.aliases` setting.
  * [Jade][] templates are compiled into modules that export a template function, and also have a `.toElement()` method
    that renders the template and returns the resulting single element.
* Compile all [Stylus][] files specified in the `winningJS.stylus.src` setting, writing the results to the
  `winningJS.stylus.dest` location.
* Compile a [Jade][] index file template (as shown above) into a HTML page, with all of the Browserified modules
  referenced as `<script>` tags and all of the compiled Stylus files referenced as `<link>` tags. The template file and
  resulting HTML file locations are configurable as `winningJS.src` and `winningJS.dest`, respectively.

## How to Use with Visual Studio

Although more work will eventually be done in this area, to automate this process, for now you can manually integrate
grunt and WinningJS-build into your Visual Studio project. This causes the above build steps to be run when using
Visual Studio's *Build* task.

Open your `.jsproj` file for editing (e.g. in Notepad). Assuming you have a `grunt.js` gruntfile similar to the one
above, where all the output is put into an `out` directory and your source files are in `index.jade`, `styles`, `lib`,
`components`, etc., you should edit the main `<ItemGroup>` section to look something like the following:

```xml
<None Include="grunt.js" />
<None Include="package.json" />
<None Include="index.jade" />
<None Include="styles\**\*.*" />
<None Include="lib\**\*.*" />
<None Include="components\**\*.*" />
<Content Include="out\**\*.*" />
```

This tells Visual Studio (or MSBuild, more accurately) to not include any of your source files in the deployed
application, but instead to include the contents of the `out` directory.

Once this is in place, add the following entries:

```xml
<Target Name="BeforeBuild" Inputs="@(None)" Outputs="out\index.html">
    <Exec Command="grunt.cmd" />
</Target>
<Target Name="BeforeClean">
    <RemoveDir Directories="out" />
</Target>
```

This tells Visual Studio that whenever any of the source files have a later modified date than `out\index.html`, it
should re-run the `grunt.cmd` task. Furthermore, it will clean the `out` directory if the build is cleaned, either
manually or as part of a rebuild.

A final step you need to implement, in order to make the automatic change-detection work, is to add the line

```xml
<DisableFastUpToDateCheck>true</DisableFastUpToDateCheck>
```

inside the `<PropertyGroup Label="Globals">` section.

## Sample App

WinningJS-build is used by the [WinningJS-todo][] sample application, which is a great place to see it in action.
In particular, you can see fully-configured gruntfiles and `.jsproj` files.

[Browserify]: https://github.com/substack/node-browserify
[Stylus]: http://learnboost.github.com/stylus/
[Jade]: http://jade-lang.com/
[grunt]: http://gruntjs.com/
[WinningJS-todo]: https://github.com/NobleJS/WinningJS-todo
