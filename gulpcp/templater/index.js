var through = require('through2'),
    Templator = require('./templater'),
    PluginError = require('plugin-error');


const PLUGIN_NAME = 'gulp-template-html';

function gulpTemplator (options) {

  var templator = new Templator(options);

  function process (file, enc, cb) {
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams aren\'t supported'));
    }

    if (file.isBuffer()) {
      var fileName = file.relative.split(".")[0]
      content = templator.processContent(file.contents.toString(enc),fileName);
      file.contents = new Buffer(content, enc);
    }

    cb(null, file);
  }

  return through.obj(process);
}

module.exports = gulpTemplator;