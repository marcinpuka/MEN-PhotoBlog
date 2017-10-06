const express = require("express"),
    bodyParser = require("body-parser"),
    app = express(),
    mongoose = require("mongoose"),
    Photo = require("./models/photo"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds")


seedDB();

//---DB Config---//
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/photos", {
    useMongoClient: true
});

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
app.use(bodyParser.urlencoded({
    extended: true
}));
var port = process.env.PORT || 3006;



//Photo.create(
//    {
//        title: "Salmon Creek",
//        image: "https://farm5.staticflickr.com/4150/4832531195_9a9934b372.jpg", 
//        description: "This is a huge granite hill.", 
//
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

//--- landing page ---//
app.get("/", (req, res) => {
    res.render("landing");
});


//--- INDEX ---//
app.get("/photos", (req, res) => {
    Photo.find({}, (err, photos) => {
        if (err) {
            console.log(err);
        } else {
            res.render("photos/index", {
                photos: photos
            });
        }
    });
});


//--- NEW ---//
app.get("/photos/new", (req, res) => {
    res.render("photos/new");
});


//--- CREATE ---//
app.post("/photos", (req, res) => {
    var title = req.body.title;
    var image = req.body.image;
    var newPhoto = {
        title: title,
        image: image,
        description: String
    };
    Photo.create(newPhoto, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/photos");
        }
    });
});


//--- SHOW ---//
app.get("/photos/:id", (req, res) => {
    Photo.findById(req.params.id).populate("comments").exec((err, foundPhoto) => {
        if (err) {
            console.log(err);
        } else {
            console.log(foundPhoto);
            res.render("photos/show", {
                foundPhoto: foundPhoto
            });
        }
    });
});

//--- COMMENTS ROUTES ---//
app.get("/photos/:id/comments/new", (req, res) => {
    Photo.findById(req.params.id, (err, photo) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {
                photo
            });
        }
    });
});

app.post("/photos/:id/comments", (req, res) => {
    Photo.findById(req.params.id, (err, photo) => {
        if (err) {
            console.log(err);
            res.redirect("/photos");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.loog(err);
                } else {
                    photo.comments.push(comment);
                    photo.save();
                    res.redirect("/photos/" + photo._id);
                }
            });
        }
    });



});



app.listen(port, () => {
    console.log("Serving demo on port 3006");
});