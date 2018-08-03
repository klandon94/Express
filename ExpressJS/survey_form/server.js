var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req,res){
    res.render("index");
})

app.post('/result', function(req,res){
    console.log("POST DATA \n\n", req.body);
    res.render("created", {data:req.body});
})

app.listen(1234,function(){
    console.log("listening on port 1234");
})