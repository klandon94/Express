const express = require('express');
const app = express();
const bodyParser = require("body-parser");
var session = require("express-session")

app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge:60000}
}))
app.use(express.static(__dirname + "/public"));
const server = app.listen(1234);
const io = require('socket.io')(server);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var users = [];
var messages = [];
io.on('connection', function(socket){
    var socketid = socket.id;
    socket.on("new_user", function(user){
        users.push({user:user, socket:socketid});
        console.log(users[users.length-1].socket);
        io.emit("user", users[users.length-1].user);
    })
    socket.on("new_message", function(data){
        messages.push({user:users[data.poster-1].user, msg:data.message});
        io.emit("message", messages[messages.length-1]);
    })
    socket.on("disconnect", function(){
        // console.log("client has disconnected: " + socketid);
        let obj = users.find(o => o.socket === socketid);
        // console.log(users[users.indexOf(obj)]);
        // console.log(users.indexOf(obj))
        users.splice(users.indexOf(obj), users.indexOf(obj) + 1);
        socket.broadcast.emit("disconnect_user", obj);
    })
})

app.get("/", function(req,res){
    req.session.userid = users.length + 1;
    console.log(req.session.userid);
    res.render("index", {users: users, messages: messages, currentuser: req.session.userid});
})