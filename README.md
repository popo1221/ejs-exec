# ejs-exec
An ejs compile and render tool.


## The compile command
```
Usage: ejs-exec compile [sources...] [options]

Options：
  --version, -v   Show version number                                     [boolean]
  --output, -o    Output file (stdout if not provided)
  --outputDir     Output directory
  --basedir       An absolute path to the directory that relative paths are
                  *relative to* ejs template files                 [default: "."]
  --debug, -d     Enable to output generated codes to console             [boolean]
  --compileDebug  Enable to compile debug instrumentation                 [boolean]
  --strict, -s    Enable to generate codes in strict mode                 [boolean]
  --with, -w      Enable to use `with() {}` constructs                    [boolean]
  --rmWhitespace  Enable to remove all safe-to-remove whitespace, including
                  leading and trailing whitespace. It also enables a safer
                  version of `-%>` line slurping for all scriptlet tags (it does
                  not strip new lines of tags in the middle of a line).   [boolean]
  --delimiter     Character to use with angle brackets for open/close
                                                          [string] [default: "%"]
  --localsName    Name to use for the object storing local variables when not
                  using `with`                       [string] [default: "locals"]
  --help, -h      Show help                                               [boolean]

Examples：
  ejs-exec compile template/**/*.ejs  Compile ejs in template directory to js
```

## The render command 
```
Usage: ejs-exec render <templateFile> [options]

Options：
  --version, -v  Show version number                                      [boolean]
  --output, -o   Output file (stdout if not provided)
  --data, -D     Specified the data file
  --help, -h     Show help                                                [boolean]

Examples：
  ejs-exec render template/test.ejs       Render template/test.ejs with data
  --data data.json -o test.html             of data.json
```

## Note
- The file dist/ejs.js is required when using the tool.
- [es5-shim](https://github.com/es-shims/es5-shim) is required when in browser(<= IE8).
