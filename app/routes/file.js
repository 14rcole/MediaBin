var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var python = require('python-shell');
var fs = require('fs-extra');
var File = mongoose.model('File');
var User = mongoose.model('User');

// POST
exports.postFile = function (req, res) {
    var data = req.body.data;
    console.log("%o", req.body);
    var toParse = data.substring(data.indexOf(',')+1);  
    var buf = Buffer.from(toParse, 'base64');
    var basename = req.body.filename.substring(req.body.filename.lastIndexOf("\\")+1);
    filename = path.join("./uploads/", basename);
    fs.writeFile(filename, buf, function(err) {
        if (err) {
            console.log("write file error");
            res.send("upload file error");
        } else {
            var options = {
                args: ['--dbase fpdbase', '-- min-count 100', filename]
            }
            python.run('app.audfprint/audfprint.py match', options, function (err, results) {
                if (err) {
                    console.log("error matching fingerprint in database " + error);
                    res.send("error matching fingerprint in database");
>>>>>>> 2a35496dbc66120fc7a26685cd707eeb001d0f67
                } else {
                    if (results.contains("NOMATCH")) {
                        // generate File object
                        File.create({
                            ref_count: 1,
                            type: "media",
                            size: fs.statSync(filename)["size"],
                            loc: filename
                        }, function (err, file) {
                            if (err) {
                                console.log("error creating new file: " + err);
                                res.send("error creating new file");
                            } else {
                                fileParent = filename.substring(0, req.file.path.lastIndexOf('/'));
                                fileExtension = filename.substring(req.file.path.lastIndexOf('.'));
                                newFilename = fileParent.concat(file._id).concat(fileExtension);
                                fs.move(filename, newFilename, function (err) {
                                    if (err) {
                                        console.log("error changing filename: " + err);
                                        res.send("error changing filename");
                                    } else {
                                        options = {
                                            args: ['--dbase fpdbase', newFilename]
                                        }
                                        python.run('app/audfprint/audfprint.py add', options, function (err, results) {
                                            if (err) {
                                                console.log("error adding fingerprint to database: " + err);
                                                res.send("error adding fingerprint to database");
                                            } else {

                                                console.log("POST adding new file " + file._id);
                                                res.send(file);
                                            }
                                        });         
                                    }
                                });
                            }
                        });
                    } else {
                        // Add access
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
                        console.log("Found a match! " + result);
                        res.send("MATCH");
                    }
                }
            });

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
