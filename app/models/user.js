// app/models/user.js

// grab the mongoose module
var mongoose = require('mongoose');

// Define our schema for the users' files
userFileSchema = new mongoose.Schema({
    file_id: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
    upload_date: { type: Date, default: Date.now },
    name: String,
    extension: String
});


// define our user schema
userSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    username: String,
    email: String,
    password: String,
    files: [userFileSchema]
});

userSchema.methods.addFile = function(file) {
    this.files.push(file);

    return this.files;
}

userSchema.methods.removeFile = function(file_id) {
    for (var f in this.files) {
        if (f.file_id == file_id) {
            var index = this.file.indexOf(f);
            this.files = this.files.splice(index, 1);
        }
    }
}

userSchema.methods.findFileByName = function(filename) {
    for (var f in this.files) {
        if (f.name == filename) {
            return f;
        }
    }
    return null;
}

userSchema.methods.findFileById = function(file_id) {
    for (var f in this.files) {
        if (f.file_id == file_id) {
            return f;
        }
    }
    return null;
}
mongoose.model('User', userSchema);

// module.exports = userSchema;
