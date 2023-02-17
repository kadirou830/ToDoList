const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const _ = require("lodash");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect(
  "mongodb+srv://admin-kd:1980@cluster0.y5cswcl.mongodb.net/todolistdb",
  //"mongodb://127.0.0.1:27017/todolistdb",
  () => {
    console.log("DB connected");
  },
  (e) => console.log(e)
);

const itemSchema = new mongoose.Schema({
    name: String,    
  });

  const Item = mongoose.model("Item", itemSchema);

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
})

const List = mongoose.model('List', listSchema)

app.get("/", function(req, res) {
 
  let currentDay = date.getToday();
  Item.find((e, items) => {
    if (e) {
      console.log(e);
    } else {
    res.render('list', {listTitle: "today", newListItem: items});
    }
  });

    
})

app.get("/about", function(req, res){
    res.render('about');
})


app.get('/:paramName', function(req, res){
  const customName = _.capitalize(req.params.paramName)
  List.findOne({name: customName}, (e, listFound)=>{
    if(e){
      console.log(e)
    }else{
        if (!listFound) {
          const list = new List({
            name: customName,
            items: []
          })
          list.save()
          res.render('list', {listTitle: customName, newListItem: list.items});
        } else {
          res.render('list', {listTitle: customName, newListItem: listFound.items});
        }
    }
  })
})


app.post("/", (req, res) => {
    let myItem = req.body.myNote;
    let mylist = req.body.list;
          const newItem = new Item({ name: myItem });
    if (mylist === "today"){
          newItem.save().then(()=> console.log(newItem.name + " added to " + mylist))
          res.redirect("/");
    }else{
      List.findOne({name: mylist}, (e, listFound)=>{
        if(e){
          console.log(e)
        }else{
            listFound.items.push(newItem)
            listFound.save().then(()=> console.log(newItem.name + " added to " + mylist))
            res.redirect("/" + mylist);
        }})
    }
});

app.post("/delete", (req, res) => {
    const mylistremoving= req.body.checkboxList
    const checkedItemId = req.body.checkbox
    if (mylistremoving === "today"){
          Item.findByIdAndRemove(checkedItemId, (e)=> {
        if (e) {
             console.log(e)   
        } else {
           console.log(checkedItemId + " deleted") 
        }
    
    }) ;
    res.redirect("/");
    }else{
      List.findOneAndUpdate({name: mylistremoving},
        {$pull: {items: {_id: checkedItemId}}},
        (e, listFound)=>{
        if(e){
          console.log(e)
        }else{
            console.log(checkedItemId + " deleted")
            res.redirect("/" + mylistremoving);
        }})
    }

})


app.listen(3000, function(){
    console.log("server started on port: 3000");
})

