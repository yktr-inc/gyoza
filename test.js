const http = require('http');
const gyoza = require('./lib');

//create a server object:
http.createServer(function (req, res) {

  const tplConf = {
    basedir: './views',
    cache: false,
  };

  const tplEngine = gyoza(tplConf);

  const view = tplEngine.render('index', {name: 'Kevin'});
  
  res.write(view);
  res.end();

}).listen(9090); 
