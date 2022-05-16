var http = require('http');

http.createServer((req,res)=>{


    res.writeHead(200,{'Content-Type':'text/plain'});

    res.end("hello world\n");

}).listen(8080);

console.log("Server running on port 8080")