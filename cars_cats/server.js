var express = require("express");
var app = express();

app.use(express.static(__dirname + "/static"));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get("/cars", function(request,response){
    response.render('cars')
})
app.get("/cats", function(request,response){
    response.render('cats')
})
app.get("/cars/new", function(request,response){
    response.render('form')
})

app.get("/cuddles", function(request,response){
    var cats_data = {
        name: "cuddles",
        fave_food: "Spaghetti",
        age: "5",
        sleeping_spots: ["under the bed", "in a sunbeam"]
    }
    response.render('details', {cats:cats_data});
})

app.get("/bubbles", function(request,response){
    var cats_data = {
        name: "bubbles",
        fave_food: "Lasagna",
        age: "8",
        sleeping_spots: ["under a rock", "in a whirlpool"]
    }
    response.render('details', {cats:cats_data});
})

app.listen(8000, function(){
    console.log("listening on port 8000");
})