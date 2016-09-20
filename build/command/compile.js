'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = exports.examples = exports.options = exports.usage = exports.describe = exports.command = undefined;

var _vinylFs = require('vinyl-fs');

var _vinylFs2 = _interopRequireDefault(_vinylFs);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _compile = require('../core/compile');

var _compile2 = _interopRequireDefault(_compile);

var _concat = require('../core/concat');

var _concat2 = _interopRequireDefault(_concat);

var _rename = require('../core/rename');

var _rename2 = _interopRequireDefault(_rename);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * $ ejs-exec compile <options>
 *
 * This commands compile ejs templates to js
 * & Optionally UI.
 *
 * @param opts
 * @returns {Function}
 */

// Command definition
var command = exports.command = 'compile';
var describe = exports.describe = 'Compile ejs template to js';
var usage = exports.usage = 'Usage: $0 compile [sources...] [options]';
var options = exports.options = {
  output: {
    alias: 'o',
    desc: 'Output file (stdout if not provided)'
  },
  outputDir: {
    desc: 'Output directory'
  },
  basedir: {
    default: '.',
    desc: 'An absolute path to the directory that relative paths are *relative to* ejs template files'
  },
  template: {
    alias: 't',
    desc: 'The template to generate js code. `templateBody` and `templateName` can be used in the template.'
  },
  debug: {
    type: 'boolean',
    alias: 'd',
    desc: 'Enable to output generated codes to console'
  },
  compileDebug: {
    type: 'boolean',
    desc: 'Enable to compile debug instrumentation'
  },
  strict: {
    alias: 's',
    type: 'boolean',
    desc: 'Enable to generate codes in strict mode'
  },
  with: {
    alias: 'w',
    type: 'boolean',
    desc: 'Enable to use `with() {}` constructs'
  },
  rmWhitespace: {
    type: 'boolean',
    desc: 'Enable to remove all safe-to-remove whitespace, including leading and trailing whitespace. It also enables a safer version of `-%>` line slurping for all scriptlet tags (it does not strip new lines of tags in the middle of a line).'
  },
  delimiter: {
    default: '%',
    type: 'string',
    desc: 'Character to use with angle brackets for open/close'
  },
  localsName: {
    default: 'locals',
    type: 'string',
    desc: 'Name to use for the object storing local variables when not using `with`'
  }
};

var stdout = _through2.default.obj(function (file, encoding, cb) {
  if (file.isNull() || file.isDirectory() || file.isStream()) {
    cb();
    return;
  }

  console.log(file.contents.toString());
  cb();
  return;
});

var examples = exports.examples = [{
  cmd: '$0 compile template/**/*.ejs',
  desc: 'Compile ejs in template directory to js'
}];

function getCompileOptions(opts) {
  var debug = opts.debug;
  var compileDebug = opts.compileDebug;
  var strict = opts.strict;
  var rmWhitespace = opts.rmWhitespace;
  var basedir = opts.basedir;
  var delimiter = opts.delimiter;
  var localsName = opts.localsName;
  var template = opts.template;


  var _with = opts['with'];

  return {
    debug: debug,
    compileDebug: compileDebug,
    strict: strict,
    rmWhitespace: rmWhitespace,
    basedir: basedir,
    delimiter: delimiter,
    localsName: localsName,
    template: template,
    _with: _with
  };
}

var handler = exports.handler = function handler(opts) {
  var input = opts.input;
  var output = opts.flags.output;
  var outputDir = opts.flags.outputDir;

  var combine = !!output;
  var defaultStdout = !output && !outputDir;
  var sources = input.length ? input : '.';
  var compileOpts = getCompileOptions(opts.flags);

  if (defaultStdout) {
    _vinylFs2.default.src(sources).pipe((0, _compile2.default)(compileOpts)).pipe(stdout);
  } else if (combine) {
    _vinylFs2.default.src(sources).pipe((0, _compile2.default)(compileOpts)).pipe((0, _concat2.default)(output)).pipe(_vinylFs2.default.dest(process.cwd));
  } else {
    _vinylFs2.default.src(sources).pipe((0, _compile2.default)(compileOpts)).pipe((0, _rename2.default)({ extname: '.js' })).pipe(_vinylFs2.default.dest(outputDir));
  }
};