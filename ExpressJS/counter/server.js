var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var session = require('express-session');

app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge:60000}
}))
app.use(express.static(__dirname + "/static"));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req,res){
    if (req.session.count) req.session.count++;
    else req.session.count = 1;
    res.render("counter", {count: req.session.count});
})

app.post('/reset', function(req,res){
    req.session.destroy();
    res.redirect('/');
})

app.listen(1234, function(){
    console.log("listening on port 1234");
})