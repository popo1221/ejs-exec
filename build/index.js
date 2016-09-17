'use strict';

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _compile = require('./command/compile');

var Compile = _interopRequireWildcard(_compile);

var _render = require('./command/render');

var Render = _interopRequireWildcard(_render);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commands = [Compile, Render];
var epilogue = ['For help running a certain command, type <command> --help', 'eg: $0 compile --help'].join('\n');

var yargs = _yargs2.default.version(function () {
  return _package2.default.version;
}).alias('help', 'h').alias('version', 'v');

commands.forEach(function (cmd) {
  yargs = yargs.command(cmd.command, cmd.describe);
});

yargs.epilogue(epilogue);

var command = yargs.argv._[0];
var current = commands.filter(function (cmd) {
  return cmd.command === command;
})[0];
if (current) {
  yargs = yargs.reset().usage(current.usage).options(current.options);

  // Examples
  (current.examples || []).forEach(function (example) {
    return yargs = yargs.example(example.cmd, example.desc);
  });

  yargs.help().strict().alias('help', 'h');

  // Handle argv
  var argv = yargs.argv;
  current.handler({ input: argv._.slice(1), flags: argv });
} else {
  yargs.showHelp();
}