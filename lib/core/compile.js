import through2 from 'through2';
import path from 'path';
import ejs from 'ejs';

export default function compile(opts) {
  const compileOpts = {
    client: true,
    cache: false,
    ...opts
  };

  const basedir = path.resolve(opts.basedir);
  const templateFile = path.join(__dirname, '../../template/tpl.ejs');

  function resolveTemplateName(file) {
    return file.relative.slice(0, -file.extname.length);
  }

  return through2.obj((file, encoding, cb) => {
    if (file.isNull() || file.isDirectory()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      return cb(new Error('Streaming is not supported!'));
    }

    // Set new base
    file.base = basedir;

    let templateFn = ejs.compile(file.contents.toString(), compileOpts);
    let templateName = resolveTemplateName(file);

    try {
      ejs.renderFile(templateFile, {
        templateName: templateName,
        templateBody: templateFn.toString()
      }, function(err, str) {
        if (err) {
          return cb(err);
        }
        file.contents = new Buffer(str);
        cb(null, file);
      });
    } catch (err) {
      return cb(err);
    }
  });
}
