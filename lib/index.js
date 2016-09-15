import Yargs from 'yargs';
import * as Compile from './command/compile';
import pkg from '../package.json';

const commands = [Compile];
const epilogue = [
  'For help running a certain command, type <command> --help',
  'eg: $0 compile --help'
].join('\n');

let yargs = Yargs
  .version(() => pkg.version)
  .alias('help', 'h')
  .alias('version', 'v');

commands.forEach(cmd => {
  yargs = yargs.command(cmd.command, cmd.describe);
});

yargs.epilogue(epilogue);

let command = yargs.argv._[0];
let current = commands.filter(cmd => cmd.command === command)[0];
if (current) {
  yargs = yargs.reset()
    .usage(current.usage)
    .options(current.options);

  // Examples
  (current.examples || []).forEach(example =>
    yargs = yargs.example(example.cmd, example.desc));

  yargs
    .help()
    .strict()
    .alias('help', 'h');

  // Handle argv
  let argv = yargs.argv;
  current.handler({input: argv._.slice(1), flags: argv});
} else {
  yargs.showHelp();
}
