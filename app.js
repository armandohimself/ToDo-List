const express = require("express"); //'import' over this light-weight server

const app = express(); //tell your program that the name app is what is tied to the server

app.set('view engine', 'ejs'); //tells app to set ejs as the view engine

app.use(express.urlencoded({extended: true})); //if your sending form data you must specify this

app.use(express.static("public"));

let items = [];
let workItems = [];

//* Root Route
app.get("/", function(req, res) {

    console.log(req.body);

    let today = new Date();
    let currentDay = today.getDay();
    let dayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; 
    let day = dayArr[currentDay];

    res.render('lists', {listTitle: day, ToDoitems: items});
    //end
});

app.post("/", function(req, res) {
    console.log(req.body);

    let item = req.body.todo;

    if(req.body.list === "Work") {
        console.log("Got through if");
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        //res.render("lists", {ToDoitem: item}); can't use this because ToDoitem is not defined when loading html an app.get
        res.redirect("/");
    }
    
});

//* Work Route
app.get("/work", function(req, res) {
    res.render("lists", {listTitle: "Work List", ToDoitems: workItems});
});

app.post("/work", function(req, res) {
    
});

app.listen(3000, function() {
    console.log("Listening on PORT 3000");
});