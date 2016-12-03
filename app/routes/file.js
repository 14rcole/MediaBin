var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var python = require('python-shell');
var File = mongoose.model('File');
var User = mongoose.model('User');

// POST
router.post('/file/upload', function (req, res) {
    // TODO: add fingerprint to database

    // TODO: Save file to server
    
    // generate File object
    File.create({
        ref_count: 1,
        type: req.body.type,
        size: req.body.size,
        loc: ""
    }. function (err, file) {
        if (err) {
            console.log("error creating new file: " + err);
            res.send("error creating new file");
        } else {
            console.log("POST adding new file " + file._id);
            res.send(file);
        }
    });
});


// GET
router.get('/file/fprintmatch', function (req, res) {
    // check if the file is in the database
    var options = {
        args: ['--dbase fpdbase', '-- min-count 100', req.files]
    }
    python.run('audfprint.py match', options, function (err, results) {
        if (err) {
            console.log("error matching fingerprint in database " + error);
            res.send("error matching fingerprint in database");
        } else {
            if (/* TODO: no match */) {
                console.log("no matching fingerprint in database");
                res.send("NOMATCH");
            } else {
                match_id = 12345; // TODO: make it get the actual match id from the output
                File.findById(match_id, function (err, file) {
                    if (err) {
                        console.log("could not find matching json: " + err);
                        res.send("found match in fprint database but not in file database");
                    } else {
                        file.incrementRefCount();
                        console.log("GET file with id: " + match_id);
                        res.json(file);
                    }
                });
            }
        }
    });
});

router.get('/file/:uid/:filename', function (req, res) {
    User.findById(req.params.uid, function (err, user) {
        if (err) {
            console.log("Error finding user: " + err);
            res.send("Error finding user");
        } else {
            file = User.findFileByName(req.params.filename);
            if (file == null) {
                console.log("Could not find file " + req.params.filename + " for user " + user.name);
                res.send("Could not find file with that name for the given user");
            } else {
                File.findById(file._id, function (err, file) {
                    if (err) {
                        console.log("error finding file with given id: " + err);
                        res.send("error finding file in database with corresponding id");
                    } else {
                        console.log("GET file " + file._id);
                        res.json(file);
                    }
                });
            }
        }
    });
});

router.get('/file/download/:uid/:fileid', function (req, res) {
    User.findById(req.params.uid, function (err, user) {
        if (err) {
            console.log("Error finding user: " + err);
            res.send("Error finding user");
        } else {
            file = user.findFileById(req.params.fileid);
            if (file == null) {
                console.log("Could not find file " + req.params.fileid + " for user " + user.name);
                res.send("Could not find file with that id for the given user");
            } else {
                console.log("GET file " + file._id);
                // TODO: download the file
            }
        }
    });
});

// DELETE
router.delete('/file/delete/:uid/:fileid', function (req, res) {
    User.findById(req.params.uid, function (err, user) {
        if (err) {
            console.log("Error finding user: " + err);
            res.send("Error finding user");
        } else {
            userFile = user.findFileById(req.params.fileid);
            if (userFile == null) {
                console.log("Could not find file " + req.params.fileid + " for user " + user.name);
                res.send("Could not find file with that id for the given user");
            } else {
                user.removeFile(req.params.fileid);
                file = File.findById(req.params.fileid, function (err, file) {
                    if (err) {
                        console.log("Could not find file " + req.params.fileid);
                        res.send("Could not find file with that id in the database");
                    } else {
                        file.decrememntRef(req.params.fileid);
                        if (file.ref_count <= 0) {
                            // TODO: Delete <file._id> from fingerprint database
                            loc = file.loc;
                            // TODO: Delete <loc> from storage
                            File.remove(file, function (err, result) {
                                if (err) {
                                    console.log("could not remove file from database: " + err);
                                    res.send("could not remove file from database");
                                } else {
                                    console.log("DELETE file from database with id: " + fileid);
                                    res.send("DELETE file from database");
                                }
                            });
                        } else {
                            console.log("DELETE file from user with id: " + fileid);
                            res.send("DELETE file from database");
                        }
                    }
                });
            }
        }
    });
});
