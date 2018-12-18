'use strict';

const fs = require('fs');

// Create cache
// Create cache selector 
// Create compilator
// Create gateway

exports = module.exports = settings => {
    return new Gyoza(settings);
};

const Gyoza = class {

  constructor(settings) {
    this.basedir = settings.basedir;
    this.cacheDir = `${this.basedir}/.cache`;
  }

  readTpl(path) {
    return fs.readFileSync(`${this.basedir}/${path}.tpl`, 'utf8', (err, data) => {
      if (err) throw err;
      return data.toString();
    });
  }

  gateway(tpl, data) {
      const template = this.readTpl(`${tpl}`);
      this.createCacheDir();
      return this.TemplateEngine(template, data);
  }


  TemplateEngine(tpl, data) {
    var re = /{{ ([^}}]+)? }}/g, match;
    while(match = re.exec(tpl)) {
      tpl = tpl.replace(match[0], data[match[1]])
    }
    return tpl;
  }

  createCacheDir() {
    if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir);
    }
  }

};
