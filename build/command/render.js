'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = exports.examples = exports.options = exports.usage = exports.describe = exports.command = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * $ ejs-exec render <options>
 *
 * This commands render ejs templates to html
 * & Optionally UI.
 *
 */

// Command definition
var command = exports.command = 'render';
var describe = exports.describe = 'Render ejs template to html';
var usage = exports.usage = 'Usage: $0 render <templateFile> [options]';
var options = exports.options = {
  output: {
    alias: 'o',
    desc: 'Output file (stdout if not provided)'
  },
  data: {
    alias: 'D',
    desc: 'Specified the data file'
  }
};

var examples = exports.examples = [{
  cmd: '$0 render template/test.ejs --data data.json -o test.html',
  desc: 'Render template/test.ejs with data of data.json'
}];

var handler = exports.handler = function handler(opts) {
  var input = opts.input[0];
  var output = opts.flags.output;
  var dataFile = opts.flags.data;

  var data = null;
  if (dataFile) {
    data = JSON.parse(_fs2.default.readFileSync(dataFile));
  }

  _ejs2.default.renderFile(input, data || {}, {}, function (err, html) {
    if (err) {
      throw new Error(err);
    }

    if (output) {
      _fs2.default.writeFileSync(output, html);
    } else {
      console.log(html);
    }
  });
};