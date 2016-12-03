// app/models/file.js

// grab the mongoose module
var mongoose = require('mongoose');

// define our file schema
var fileSchema = new Schema({
    _id: Schema.Types.ObjectId,
    type: String, // music, video, etc
    quality: String,
    size: Number, // size in number of bytes
    loc: String
});

fileSchema.methods.addLoc = function(loc) {
    this.loc = loc;
    return this.loc;
}

mongoose.model('File', fileSchema);

module.exports = fileSchema;
