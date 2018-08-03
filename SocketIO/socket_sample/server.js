const express = require('express');
const app = express();
app.use(express.static(__dirname + "/public"));
const server = app.listen(1337);
const io = require('socket.io')(server);
var counter = 0;

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

io.on('connection', function(socket){ //2: Triggers our server's connection listener to run, and this occurs for every new socket connection
    socket.emit('greeting', {msg: "Greetings, from server Node, brought to you by Sockets! - Server"}); //3: Then the server will emit a message 'greeting' to 
    // the client ,because we placed an emit event there
    socket.on('thankyou', function(data){ //7: The server's listener with the matching 'thank you' label will be triggered...
        console.log(data.msg); //8: And invoke its callback
    })
})

app.get("/", function(req, res){
    res.render("index.html");
})