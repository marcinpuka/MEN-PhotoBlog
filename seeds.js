var mongoose = require("mongoose");
var Photo = require("./models/photo");
var Comment = require("./models/comment");

var data = [
    {
        title: "Clouds Rest",
        image: "https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg",
        description: "blah blah blah"
    },
    {
        title: "Skinwalker ranch",
        image: "https://farm8.staticflickr.com/7419/9675518784_0f624baedd.jpg",
        description: "ghrrrrrrrrrrr!!!"
    }, {
        title: "Area 51",
        image: "https://farm8.staticflickr.com/7179/6927088769_cc14a7c68e.jpg",
        description: "no nuke cola vendis!"
    },
];

function seedDB() {
    Photo.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        data.forEach(function (seed) {
            Photo.create(seed, (err, photo) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(photo);

                    Comment.create(
                        {
                            text: "This  photo is lovely!", 
                            author: "Hommer"
                        }, (err, comment) => {
                            if(err) {
                                console.log(err);
                            } else {
                                photo.comments.push(comment);
                                photo.save();
                                console.log("Created new comment");
                            }    
                        }
                    );
                }
            });
        });
    });
};

module.exports = seedDB;

