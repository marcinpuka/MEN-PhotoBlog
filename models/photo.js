var mongoose = require("mongoose");
//--- Photo Schema ---//
var photoSchema = new mongoose.Schema({
    title: String,
    image: String, 
    description: String, 
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Comment"
        }
    ]
}); 

module.exports = mongoose.model("Photo", photoSchema);