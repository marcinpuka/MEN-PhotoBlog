var mongoose = require("mongoose");
//--- Photo Schema ---//
var photoSchema = new mongoose.Schema({
    title: String,
    image: String, 
    description: String, 
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User"
        }, 
        username: String
    }, 
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Comment"
        }
    ]
}); 

module.exports = mongoose.model("Photo", photoSchema);