const { mapValues } = require("async");
const express = require("express"); //'import' over this light-weight server
const date = require(__dirname + "/date.js"); //import our javascript module that we created at the root directory
const mongoose = require("mongoose");
const _ = require("lodash");

//create a db connection
mongoose.connect("mongodb://localhost:27017/todolistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//create a schema
const itemsSchema = {
    postTitle: String, 
    postBody: String
};

//creating a listSchema to hold many collections
const listSchema = {
    name: String, 
    items: [itemsSchema]
};

//list model
const List = mongoose.model("List", listSchema);

//create a data model & when we do this it will create the plural collections in mongo called items
const Item = mongoose.model("Item", itemsSchema);

//! Temp New Items
const item1 = new Item({
    postTitle: "Helper's in Royal Oak", 
    postBody: "Did Jose ask Annie & Will Rabon about referrals like I asked him to?"
});

const item2 = new Item({
    postTitle: "Plan to work out", 
    postBody: "You need to begin following a strict regime of A & B Workouts that alternate. Please add this into notion later."
});

const item3 = new Item({
    postTitle: "Date night with the lady to take her out to Hibachi", 
    postBody: "Please create reservations to take her out to Hibachi steak night."
});

const defaultItems = [item1, item2, item3];

Item.findOne(function(error, result) {
    if(error) {
        console.log("There was an error findingOne");
    } else {
        //console.log("Found results: ", result);
    }
});

console.log(date); //js allows for modules to exported and here you can see the functions we've exported for us to use

const app = express(); //tell your program that the name app is what is tied to the server

app.set('view engine', 'ejs'); //tells app to set ejs as the view engine

app.use(express.urlencoded({extended: true})); //if your sending form data you must specify this

app.use(express.static("public"));

//! Root Route
app.get("/", function(req, res) {
    console.log("In /");

    //! Show results if any
    Item.find({}, function(error, results) {
        if(error) {
            console.log("There was an error findingOne");
        } else {
            console.log("Found results: ", results);
        }

        if (results.length === 0) {
            //! Insert some default items if none
            Item.insertMany(defaultItems, function(error, results) {
                if(error) {
                    console.log("There was an error in insertMany");
                } else {
                    console.log("Found results: ", results);
                }  
            });
            res.redirect("/");
        } else {
            let day = date.getDay();
            //! render the list by passing it over as a javascript object
            res.render('lists', {listTitle: day, ToDoitems: results});
        }
    });
});

//! / POST route to add new items
app.post("/", function(req, res) {

    const listName = req.body.list;

    const insertNewItem = new Item({
        postTitle: req.body.todo,
    });

    console.log("At / trying to insertNewItem. That insertNewItem is: ", insertNewItem);

    let day = date.getDay();

    if (listName === day) {
        console.log("listName === day | today's date is: ", day);
        //Then most likely we are in the home route and should just add normally
        insertNewItem.save(function(error){
            if(error) {
                console.log("Couldn't insertNewItem");
            } else {
                console.log("insert[ed]NewItem");
            }
        });
        res.redirect("/");
    } else {
        //we are in a custom list and need to find out if it was already created to add an item to it's list
        console.log("We're not at the home POST route and instead we're in a list called: ", listName);
        List.findOne({name: listName}, function(error, foundList) {
            if(error) {
                console.log("List.findOne has an error at the home POST route", error);
            } else {
                console.log("List.findOne foundList at home Post route: ", foundList);
                foundList.items.push(insertNewItem);
                foundList.save();
                res.redirect("/" + listName);
            }
        });
    }
    
});

app.get("/:customListName", function(req, res) {

    const customListName = _.capitalize(req.params.customListName);
    
    List.findOne({name: customListName}, function(error, result) {
        if (!error) {
            console.log("No errors found in List.findOne");
            if(!result) {
                console.log("Found results");
                //Create new list
                const newCustomList = new List({
                    name: customListName, 
                    items: defaultItems
                });
                console.log("Saving newCustomList");
                newCustomList.save(function(error){
                    if(error) {
                        console.log("Couldn't newCustomList");
                    } else {
                        console.log("insert[ed]newCustomList");
                        res.redirect("/" + customListName);
                    }
                });
            } else {
                //show existing list
                console.log("Results from /:customListName were: ", result);
                console.log("newCustomList has a list name that matched: ", result.name);
                res.render('lists', {listTitle: result.name, ToDoitems: result.items});
            }
        }
    });

});


//! /delete route by id
app.post("/delete", function(req, res) {
    console.log("In /delete route POST", req.body);
    const deleteItem = req.body.deleteItem;
    const listName = req.body.list;

    let day = date.getDay();

    if (listName === day) {
        //delete from home route
        Item.findByIdAndRemove(deleteItem, function(error, result) {
            if (error) {
                console.log("There was an error deleting this item", error);
            } else {
                console.log("Succesfully deleted this item", deleteItem);
                res.redirect("/");
            }
        });
    } else {
        //delete from custom list
        List.findOne({name: listName}, function(error, result) {
            console.log("In the List.findOne delete from custom list block");
            if(error) {
                console.log("Error finding List.findOne in delete route", error);
            } else {
                console.log("This is what was found in the list collection results when trying to delete", result);

                List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: deleteItem}}}, function(error, foundList) {
                    if (error) {
                        console.log("There was an error in List.findOneAndUpdate: ", error);
                    } else {
                        res.redirect("/"+listName)
                        console.log("List.findOneAndUpdate results: ", foundList);
                    }
                });   
            }
        });
    }
    
});

app.listen(3000, function() {
    console.log("Listening on PORT 3000");
});