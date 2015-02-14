if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}

var http = require('http'),
    fs = require('fs');
var server = http.createServer();
server.on('request', function(req, res){
  var rootPath =  __dirname + "/..";
  var path = rootPath + req.url;
  var url = req.url;
  fs.readFile(path, 'utf-8' ,function(err, data){
    if(err) {
      res.writeHead('404', {'Content-Type' : 'text/plain'})
      res.write("not found");
      console.log("not found. [" + path + "]");
      res.end();
      return;
    }

    var headContentType = 'text/html';
    if (url.startsWith("/css")) headContentType = 'text/css';
    if (url.startsWith("/js")) headContentType = 'text/javascript';
    if (url.startsWith("/data")) headContentType = 'text/json';

    res.writeHead('200', {'Content-Type' : headContentType});
    res.write(data);
    res.end();
  });
});

server.listen("6789", "127.0.0.1");
console.log("server listening...")
