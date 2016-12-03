var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var python = require('python-shell');
var multer = require('multer');
var fs = require('fs-extra');
var File = mongoose.model('File');
var User = mongoose.model('User');

// POST
exports.postFile = function (req, res) {
    if (!req.files.fingerprint || !req.files.video) {
        console.log("error receiving one or more files");
        res.send("error receiving one or more files");
    } else {
        var fingerprintJson = req.files.fingerprint;
        var options = {
            args: ['--dbase fpdbase', fingerprintJson.path]
        }
        python.run('app/audfprint/audfprint.py add', options, function (err, results) {
            if (err) {
                console.log("error adding fingerprint to database: " + err);
                res.send("error adding fingerprint to database");
            } else {
                // generate File object
                var mediaJson = req.files.mediaFile;    
                File.create({
                    ref_count: 1,
                    type: req.body.type,
                    size: req.body.size,
                    loc: mediaJson.path
                }, function (err, file) {
                    if (err) {
                        console.log("error creating new file: " + err);
                        res.send("error creating new file");
                    } else {
                        console.log("POST adding new file " + file._id);
                        res.send(file);
                    }
                });         
            }
        });
    } 
};


// GET
exports.matchFprint = function (req, res) {
    // check if the file is in the database
    var options = {
        args: ['--dbase fpdbase', '-- min-count 100', req.file.filename]
    }
    python.run('app.audfprint/audfprint.py match', options, function (err, results) {
        if (err) {
            console.log("error matching fingerprint in database " + error);
            res.send("error matching fingerprint in database");
        } else {
            if (results.includes("NOMATCH")) {
                console.log("no matching fingerprint in database");
                res.send("NOMATCH");
            } else {
                var start_index = results.indexOf("Matched ") + 8;
                var  end_index = start_index + results.substring(start_index).indexOf(" ");
                var matchFile = results.substring(start_index, end_index);
                start_index = matchFile.indexOf("/") + 1;
                end_index = matchFile.lastIndexOf(".");
                match_id = matchFile.substring(start_index, end_index);
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
};

exports.getFile = function (req, res) {
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
};

exports.downloadFile = function (req, res) {
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
                res.sendFile(file.loc);
            }
        }
    });
};

// DELETE
exports.deleteFile = function (req, res) {
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
                            var filename = file._id + '.afpt';
                            var options = {
                                args: ['--dbase fpdbase', filename]
                            }
                            python.run('app/audfprint/audfprint.py remove', options, function (err, results) {
                                if (err) {
                                    console.log("error removing fingerprint from database: " + err);
                                    res.send("error removing fingerprint from database");
                                } else {
                                    loc = file.loc;
                                    fs.remove(loc, function(err) {
                                        if (err) {
                                            console.log("error deleting file from server:" + err);
                                            res.send("error deleting filefrom server");
                                        } else {
                                            File.remove(file, function (err, result) {
                                                if (err) {
                                                    console.log("could not remove file from database: " + err);
                                                    res.send("could not remove file from database");
                                                } else {
                                                    console.log("DELETE file from database with id: " + fileid);
                                                    res.send("DELETE file from database");
                                                }
                                            });
                                        }
                                    });
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
};
