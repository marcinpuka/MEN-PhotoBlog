//--- COMMENTS ROUTES ---//
const   express     = require("express"), 
        router      = express.Router({mergeParams: true}), 
        Photo       = require("../models/photo"),
        Comment     = require("../models/comment")


router.get("/new", isLoggedIn, (req, res) => {
    Photo.findById(req.params.id, (err, photo) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {photo:photo});
        }
    });
});

router.post("/", isLoggedIn,(req, res) => {
    Photo.findById(req.params.id, (err, photo) => {
        if (err) {
            console.log(err);
            res.redirect("/photos");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.loog(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    photo.comments.push(comment);
                    photo.save();
                    res.redirect("/photos/" + photo._id);
                }
            });
        }
    });
});

//--- EDIT COMMENT ---//
router.get("/:comment_id/edit", (req,res) => {
        Comment.findById(req.params.comment_id, (err, comment)=> {
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {photo_id: req.params.id, comment: comment});
        }
    });
});

router.put("/:comment_id", (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/photos/" + req.params.id);
        }
    });
});


function isLoggedIn (req, res, next) {
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

module.exports = router;