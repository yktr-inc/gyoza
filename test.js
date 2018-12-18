const http = require('http');
const gyoza = require('./lib');

//create a server object:
http.createServer(function (req, res) {
  const name = 1;
  
  const tplDir = './views';

  const tplConf = {
    basedir:tplDir
  };

  const tplEngine = gyoza(tplConf);

  console.log(tplEngine.gateway('index', {name: 'louis'}));

  res.end();

}).listen(8080); 
