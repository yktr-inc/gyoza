'use strict';

const fs = require('fs');
var path = require('path');
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

  buildTpl(path) {
    let template = this.readTpl(path);
    let re = /{{ ([^}}]+)? }}/g, match;
    while(match = re.exec(template)) {
      template = template.replace(match[0], '${args.'+match[1]+'}')
    }
    return template;
  }

  processTpl(template, path){
    fs.writeFileSync(`${this.cacheDir}/${path}.js`, this.compiledVersion(template), (err) => {
      if(err) {
          return console.log(err);
      }
    }); 
  }

  compiledVersion(tpl){
    let compiled = 'const view = (args) => ';
    compiled += '\n`'+tpl+'`';
    compiled += '\nmodule.exports = view;';
    return compiled;
  }


  gateway(tpl, data) {
      
      this.createCacheDir();
      console.log(this.compiledVersionExists(tpl));

      const raw = this.buildTpl(tpl);
      this.processTpl(raw, tpl);        

      return this.renderTemplate(tpl, data);
  }

  renderTemplate(tpl, data){
    const view = require( path.resolve( __dirname, `../views/.cache/${tpl}` ) );
    return view(data);
  }

  compiledVersionExists(tpl){
    return fs.existsSync(`${this.cacheDir}/${tpl}.js`);
  }

  createCacheDir() {
    if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir);
    }
  }

};
