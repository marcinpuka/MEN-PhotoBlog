const   express             = require("express"),
        bodyParser          = require("body-parser"),
        app                 = express(),
        mongoose            = require("mongoose"),
        Photo               = require("./models/photo"),
        Comment             = require("./models/comment"),
        seedDB              = require("./seeds"), 
        passport            = require("passport"), 
        LocalStrategy       = require("passport-local"), 
        User                = require("./models/user"), 
        methodOverride      = require("method-override"), 
        flash               = require("connect-flash") 

const   commentRoutes       = require("./routes/comments"), 
        photoRoutes         = require("./routes/photos"), 
        indexRoutes         = require("./routes/index")
    




//---DB Config---//
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/photos", {
    useMongoClient: true
});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

//--- Public, Flash & Method-override ---//
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

var port = process.env.PORT || 3001;


//--- Router ---//
app.use(indexRoutes);
app.use("/photos", photoRoutes);
app.use("/photos/:id/comments", commentRoutes);




app.listen(port, () => {
    console.log(`Serving demo on port ${port}`);
});