import fs from 'fs';
import ejs from 'ejs';

/**
 * $ ejs-exec render <options>
 *
 * This commands render ejs templates to html
 * & Optionally UI.
 *
 */

// Command definition
export const command = 'render';
export const describe = 'Render ejs template to html';
export const usage = 'Usage: $0 render <templateFile> [options]';
export const options = {
  output: {
    alias: 'o',
    desc: 'Output file (stdout if not provided)'
  },
  data: {
    alias: 'D',
    desc: 'Specified the data file'
  }
};


export const examples = [
  {
    cmd: '$0 render template/test.ejs --data data.json -o test.html',
    desc: 'Render template/test.ejs with data of data.json'
  }
];


export const handler = function(opts) {
  const input = opts.input[0];
  const output = opts.flags.output;
  const dataFile = opts.flags.data;

  let data = null;
  if (dataFile) {
    data = JSON.parse(fs.readFileSync(dataFile));
  }

  ejs.renderFile(input, data || {}, {}, function(err, html) {
    if (err) {
      throw new Error(err);
    }

    if (output) {
      fs.writeFileSync(output, html);
    } else {
      console.log(html);
    }
  });
};
