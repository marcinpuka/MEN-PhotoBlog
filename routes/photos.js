const express           = require("express"),
    router              = express.Router(),
    Photo               = require("../models/photo"),
    middleware          = require("../middleware")


//--- INDEX ---//
router.get("/", (req, res) => {
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
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("photos/new");
});


//--- CREATE ---//
router.post("/", middleware.isLoggedIn, (req, res) => {
    var title = req.body.title;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newPhoto = {
        title: title,
        image: image,
        description: description,
        author: author
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
router.get("/:id", (req, res) => {
    Photo.findById(req.params.id).populate("comments").exec((err, foundPhoto) => {
        if (err) {
            console.log(err);
        } else {
            res.render("photos/show", {
                foundPhoto: foundPhoto
            });
        }
    });
});

//--- EDIT PHOTO ---//
router.get("/:id/edit", middleware.checkPhotoOwnership, (req, res) => {
    Photo.findById(req.params.id, (err, foundPhoto) => {
        res.render("photos/edit", {
            foundPhoto: foundPhoto
        });
    });
});

//--- UPDATE PHOTO ROUTE ---//
router.put("/:id", middleware.checkPhotoOwnership,(req, res) => {
    Photo.findByIdAndUpdate(req.params.id, req.body.photo, (err, updated) => {
        if (err) {
            res.redirect("/photos");
        } else {
            res.redirect("/photos/" + req.params.id);
        }
    });
});

//--- DESTROY ---//
router.delete("/:id", middleware.checkPhotoOwnership,(req, res) => {
    Photo.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/photos");
        } else {
            res.redirect("/photos");
        }
    });
});



module.exports = router;