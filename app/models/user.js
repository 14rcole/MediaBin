// app/models/user.js

// grab the mongoose module
var mongoose = require('mongoose');

// Define our schema for the users' files
userFileSchema = new Schema({
    file_id: { type: Schema.Types.ObjectId, ref; 'File' },
    upload_date: { type: Date, default: Date.now },
    name: String,
    extension: String
});


// define our user schema
userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: { type: String, default: '' },
    username: String,
    email: String,
    password: String,
    files: [UserFile]
});

userSchema.methods.addFile = function(file) {
    this.files.push(file);

    return this.files;
}

userSchema.methods.removeFile = function(file_id) {
    for (var f in this.files) {
        if f.file_id == file_id;
        var index = this.file.indexOf(f);
        this.files = this.files.splice(index, 1);
    }
}

mongoose.model('User', userSchema);

module.exports = userSchema;
