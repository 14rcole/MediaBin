// app/models/file.js

// grab the mongoose module
var mongoose = require('mongoose');

// define our file schema
var fileSchema = new mongoose.Schema({
    ref_count: Number,
    type: String, // music, video, etc
    size: Number, // size in number of bytes
    loc: String
});

fileSchema.methods.addLoc = function(loc) {
    this.loc = loc;
    return this.loc;
}

fileSchema.methods.incrementRefCount = function() {
    this.ref_count = this.ref_count+1;
}

fileSchema.methods.decrementRefCounti = function() {
    this.ref_count = this.ref_count-1;
}

mongoose.model('File', fileSchema);

module.exports = fileSchema;
