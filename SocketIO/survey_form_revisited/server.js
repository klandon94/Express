const express = require('express');
const app = express();
app.use(express.static(__dirname + "/public"));
const server = app.listen(1234);
const io = require('socket.io')(server);
var counter = 0;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

io.on('connection', function(socket){
    socket.on('form_info', function(data){
        console.log(data);
        socket.emit('update', {data:data, random:Math.floor(Math.random()*1000)});
        // or can emit another event, i.e.
        // socket.emit('random_number)
    })
})

app.get("/", function(req, res){
    res.render("index");
})