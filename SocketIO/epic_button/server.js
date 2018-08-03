const express = require('express');
const app = express();
app.use(express.static(__dirname + "/public"));
const server = app.listen(1234);
const io = require('socket.io')(server);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var counter = 0;
io.on('connection', function(socket){
    socket.on('click', function(x){
        counter++;
        io.emit('update1', counter);
    })
    socket.on('reset', function(x){
        counter = 0;
        io.emit('update1', counter);
    })
})

app.get("/", function(req,res){
    res.render("index");
})
