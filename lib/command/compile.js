import vfs from 'vinyl-fs';
import through2 from 'through2';
import compile from '../core/compile';
import concat from '../core/concat';
import rename from '../core/rename';


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
export const command = 'compile';
export const describe = 'Compile ejs template to js';
export const usage = 'Usage: $0 compile [sources...] [options]';
export const options = {
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

const stdout = through2.obj(function(file, encoding, cb) {
  if (file.isNull() || file.isDirectory() || file.isStream()) {
    cb();
    return;
  }

  console.log(file.contents.toString());
  cb();
  return;
});

export const examples = [
  {
    cmd: '$0 compile template/**/*.ejs',
    desc: 'Compile ejs in template directory to js'
  }
];

function getCompileOptions(opts) {
  const {
    debug,
    compileDebug,
    strict,
    rmWhitespace,
    basedir,
    delimiter,
    localsName,
    template
  } = opts;

  const _with = opts['with'];

  return {
    debug,
    compileDebug,
    strict,
    rmWhitespace,
    basedir,
    delimiter,
    localsName,
    template,
    _with
  };
}

export const handler = function(opts) {
  const input = opts.input;
  const output = opts.flags.output;
  const outputDir = opts.flags.outputDir;

  const combine = !!output;
  const defaultStdout = !output && !outputDir;
  const sources = input.length ? input : '.';
  const compileOpts = getCompileOptions(opts.flags);

  if (defaultStdout) {
    vfs
      .src(sources)
      .pipe(compile(compileOpts))
      .pipe(stdout);
  } else if (combine){
    vfs
      .src(sources)
      .pipe(compile(compileOpts))
      .pipe(concat(output))
      .pipe(vfs.dest(process.cwd));
  } else {
    vfs
      .src(sources)
      .pipe(compile(compileOpts))
      .pipe(rename({extname: '.js'}))
      .pipe(vfs.dest(outputDir));
  }
};
