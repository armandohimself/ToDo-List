const express = require("express"); //'import' over this light-weight server

const app = express(); //tell your program that the name app is what is tied to the server

app.set('view engine', 'ejs'); //tells app to set ejs as the view engine

app.use(express.urlencoded({extended: true}));

var items = [];

app.get("/", function(req, res) {

    console.log(req.body);

    var today = new Date();
    var currentDay = today.getDay();
    var dayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; 
    var day = dayArr[currentDay];

    res.render('lists', {kindOfDay:day, ToDoitems: items});
    //end
});

app.post("/", function(req, res) {
    console.log(req.body);
    console.log(req.body.todo);

    item = req.body.todo;
    items.push(item);

    //res.render("lists", {ToDoitem: item}); can't use this because ToDoitem is not defined when loading html an app.get
    res.redirect("/");
});

app.listen(3000, function() {
    console.log("Listening on PORT 3000");
});