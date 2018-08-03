var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var flash = require("express-flash");
var session = require("express-session")

app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge:60000}
}))
app.use(flash()); // new for flash messages
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req,res){
    if (!req.session.holy && !req.session.result){
        var random = Math.floor(Math.random() * 100);
        req.session.holy = random;
        req.session.result = "";
        console.log(req.session.holy);
    }
    res.render("number", {data:req.session, expFlash: req.flash('error')});
})

app.post('/numbers', function(req,res){
    // console.log("POST DATA \n\n", req.body);
    if (!req.body.num){
        req.flash('error', "Please enter a number!");
        res.redirect("/");
    }
    else{
        req.session.num = parseInt(req.body.num);
        if (req.session.num < req.session.holy) req.session.result = "less";
        else if (req.session.num > req.session.holy) req.session.result = "greater";
        else if (req.session.num == req.session.holy) req.session.result = "equal";
        res.redirect("/");
    }
})

app.get('/reset', function(req, res){
    req.session.destroy();
    res.redirect("/");
})

app.listen(1234,function(){
    console.log("listening on port 1234");
})