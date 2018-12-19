'use strict';

const fs = require('fs');
var path = require('path');

exports = module.exports = settings => {
    return new Gyoza(settings);
};

const Gyoza = class {

  constructor(settings) {
    this.basedir = process.cwd()+'/'+settings.basedir;
    this.cacheDir = `${this.basedir}/.cache`;
    this.cache = settings.cache;
  }

  readFile(path) {
    return fs.readFileSync(`${this.basedir}/${path}.tpl`, 'utf8', (err, data) => {
      if (err) throw err;
      return data.toString();
    });
  }

  buildTemplate(path) {
    let template = this.readFile(path);
    let re = /{{ ([^}}]+)? }}/g, match;
    while(match = re.exec(template)) {
      template = template.replace(match[0], '${args.'+match[1]+'}')
    }
    return template;
  }

  writeCompiledVersion(template, path){
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

  render(tpl, data) {
      this.createCacheDir();
      if(!this.compiledVersionExists(tpl) || !this.cache){
        const raw = this.buildTemplate(tpl);
        this.writeCompiledVersion(raw, tpl);        
      }
      return this.loadFromCache(tpl, data);
  }

  loadFromCache(tpl, data){
    const view = require(`${this.cacheDir}/${tpl}`);
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
