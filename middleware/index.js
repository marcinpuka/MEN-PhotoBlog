const middlewareObj = {};
const Photo = require("../models/photo");
const Comment = require("../models/comment");

//--- Check Ownership ---//
middlewareObj.checkPhotoOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Photo.findById(req.params.id, (err, foundPhoto) => {
            if (err) {
                req.flash("error", "Photo not found");
                res.redirect("back");
            } else {
                if(!foundPhoto){
                    req.flash("error", "Photo not found");
                    return res.redirect("back");
                }    
                if (foundPhoto.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("back");
    }
};

//--- Check Comment Ownership ---//
middlewareObj.checkCommentOwnership = function  (req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                if(!foundPhoto){
                    req.flash("error", "Comment not found");
                    return res.redirect("back");
                } 
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};


middlewareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()){
        return next();
    } 
    req.flash("error", "Please Login");
    res.redirect("/login");
};




module.exports = middlewareObj;