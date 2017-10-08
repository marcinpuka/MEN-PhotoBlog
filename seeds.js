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
        description: "Lorem ipsum dolor sit amet, docendi consequuntur no eos. Sed laoreet recteque in, cum eu labitur molestiae. Eos ut deserunt complectitur, cu has maluisset dissentiunt. Eius eligendi noluisse per an, eos admodum incorrupte ei. Nec ut omnesque omittantur, laoreet epicurei et mel, vel cu legimus utroque adversarium.Vide affert constituam vis.No tale postea maluisset usu,id mea ludus mollis assueverit.Cum dicit delicatissimi te, esse mandamus reprehendunt mea ut.Has veri iriure theophrastus ut, est et saepe putant consectetuer.Vel et causae debitis, reque eripuit an sed.Vis ex pericula mnesarchum."
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

                    Comment.create({
                        text: "This  photo is lovely!",
                        author: "Hommer"
                    }, (err, comment) => {
                        if (err) {
                            console.log(err);
                        } else {
                            photo.comments.push(comment);
                            photo.save();
                            console.log("Created new comment");
                        }
                    });
                }
            });
        });
    });
};

module.exports = seedDB;