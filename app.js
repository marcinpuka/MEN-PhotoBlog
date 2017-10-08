const   express             = require("express"),
        bodyParser          = require("body-parser"),
        app                 = express(),
        mongoose            = require("mongoose"),
        Photo               = require("./models/photo"),
        Comment             = require("./models/comment"),
        seedDB              = require("./seeds"), 
        passport            = require("passport"), 
        LocalStrategy       = require("passport-local"), 
        User                = require("./models/user")


seedDB();

//---DB Config---//
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/photos", {
    useMongoClient: true
});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));

//--- Passport ---//
app.use(require("express-session")({
    secret: "Robiestronyjakszalony", 
    resave: false, 
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//--- locals ---//
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

var port = process.env.PORT || 3001;



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
                photos: photos, 
                currentUser: req.user
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
app.get("/photos/:id/comments/new", isLoggedIn, (req, res) => {
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

app.post("/photos/:id/comments", isLoggedIn,(req, res) => {
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

// --- AUTH ROUTES ---//
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
     var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render("register");
        } 
        passport.authenticate("local")(req, res, () => {
            res.redirect("/photos");
        });
    });
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/photos", 
        failureRedirect: "/login"
    }), (req, res) => {

    }
);

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/photos");
});

function isLoggedIn (req, res, next) {
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

app.listen(port, () => {
    console.log(`Serving demo on port ${port}`);
});