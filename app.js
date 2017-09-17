var express = require("express"), 
    bodyParser = require("body-parser"),
    app = express(), 
    mongoose = require("mongoose") 


//---DB Config---//
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/photos", {useMongoClient: true});

//--- STATIC DATA ---//
//var photos = [
//    {
//        title: "Salmon Creek",
//        image: "https://farm5.staticflickr.com/4150/4832531195_9a9934b372.jpg"
//    },
//    {
//        title: "Granite Hill",
//        image: "https://farm2.staticflickr.com/1076/826745086_e1c145c054.jpg"
//    },
//    {
//        title: "Beaver Lake",
//        image: "https://farm5.staticflickr.com/4080/4938516049_eef5cbc734.jpg"
//    }, 
//        {
//        title: "Salmon Creek",
//        image: "https://farm5.staticflickr.com/4150/4832531195_9a9934b372.jpg"
//    },
//    {
//        title: "Granite Hill",
//        image: "https://farm2.staticflickr.com/1076/826745086_e1c145c054.jpg"
//    },
//    {
//        title: "Beaver Lake",
//        image: "https://farm5.staticflickr.com/4080/4938516049_eef5cbc734.jpg"
//    }
//];


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
var port = process.env.PORT || 3006;


//--- Photo Schema ---//
var photoSchema = new mongoose.Schema({
    title: String,
    image: String
}); 
var Photo = mongoose.model("Photo", photoSchema);

//Photo.create(
//    {
//        title: "Salmon Creek",
//        image: "https://farm5.staticflickr.com/4150/4832531195_9a9934b372.jpg"
//    }
//, (err, doc) => {
//    if(err){
//        console.log(err);
//    } else {
//        console.log(doc);
//        console.log("Photo has been saved");
//    }   
//});



//--- Routes ---//
app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/photos", (req, res) => {
    Photo.find({}, (err, photos) => {
       if(err) {
           console.log(err);
       } else {
           res.render("photos", {photos: photos});
       }
    });
});

app.get("/photos/new", (req, res) => {
    res.render("new");
});


app.post("/photos", (req, res) => {
   var title = req.body.title;
   var image = req.body.image;
   var newPhoto = {
       title: title, 
       image: image
   };
  Photo.create(newPhoto, (err, newlyCreated) => {
     if(err){
         console.log(err);
     } else {
         res.redirect("/photos");
     }
  });
});


app.listen(port, () => {
    console.log("Serving demo on port 3006");
});