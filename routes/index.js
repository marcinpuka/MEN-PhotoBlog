const express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user")



//--- Routes ---//
//--- landing page ---//
router.get("/", (req, res) => {
    res.render("landing");
});

// --- AUTH ROUTES ---//
router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            //req.flash("error", err.message);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome, " + user.username + "!");
            res.redirect("/photos");
        });
    });
});

router.get("/login", (req, res) => {
    res.render("login");
});

//router.post("/login", passport.authenticate("local", 
//    {
//        successFlash: "Welcome to PhotoBlog",
//        successRedirect: "/photos", 
//        failureFlash: "Invalid username or password", 
//        failureRedirect: "/login"
//    }), (req, res) => {
//            
//    }
//);

router.post("/login", function (req, res, next) {
    passport.authenticate("local", {
        successReturnToOrRedirect: "/photos",
        failureFlash: "Invalid username or password", 
        failureRedirect: "/login",
        successFlash: "Nice to have you back, " + req.body.username + "!"
    })(req, res);
});


router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "You have been logged out.");
    res.redirect("/photos");
});


module.exports = router;