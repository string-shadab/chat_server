var fs = require('fs');
var	http = require('http');
var	sio = require('socket.io');
var url = require('url');
var qs = require('querystring');

var server = http.createServer(function(req,res){
	var data = '';
	var post_data = {};
	
	fileName = '';
	if(req.method=='GET') 	
		fileName = './index.html';
	else
		fileName = './chatroom.html';

	req.on('data', function(chunk) {
		data += chunk;
	});
	req.on('end', function() {
		post_data = qs.parse(data);
		res.writeHead(200,{'Content-type':'text/html'});
		console.log("post_data",post_data);
		res.end((fs.readFileSync(fileName,'utf8')).replace("{{ name }}",post_data.name));
	});
	console.log("path:",req.method);
	
});

server.listen(8000,function(){
	console.log('server is listening...');
});


io = sio.listen(server);

var messages = [];


io.sockets.on('connection',function(socket){
	socket.on('message',function(data){
		console.log("Received:",data);
		messages.push(data);
		socket.broadcast.emit('message',data);
	});

	messages.forEach(function(data) {
	  socket.send(data);
	});
})
