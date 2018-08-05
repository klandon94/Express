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
    var thisuser;
    socket.on("new_user", function(data){
        let time = new Date().toLocaleString();
        let notification = data+" joined the chatroom @ " + time;
        thisuser = data;
        users.push({user:data, socket:socketid});
        // console.log(users[users.length-1].socket);
        messages.push({user:data, msg: notification, time:time});
        io.emit("user", {newuser:users[users.length-1].user, note:notification});
    })
    socket.on("new_message", function(data){
        messages.push({user:users[data.poster-1].user, msg:data.message, time: new Date().toLocaleString()});
        io.emit("message", messages[messages.length-1]);
    })
    socket.on("disconnect", function(){
        // console.log("client has disconnected: " + socketid);
        let obj = users.find(o => o.socket === socketid);
        let time = new Date().toLocaleString();
        let notification = thisuser+" left the chatroom @ " + time;
        // console.log(thisuser);
        // console.log(users[users.indexOf(obj)]);
        // console.log(users.indexOf(obj))
        messages.push({user:thisuser, msg:notification, time:time});
        users.splice(users.indexOf(obj), users.indexOf(obj) + 1);
        socket.broadcast.emit("disconnect_user", {disconnecter:thisuser, note:notification});
    })
})

app.get("/", function(req,res){
    req.session.userid = users.length + 1;
    // console.log(req.session.userid);
    res.render("index", {users: users, messages: messages, currentuser: req.session.userid});
})