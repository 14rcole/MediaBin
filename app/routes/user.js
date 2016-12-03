var express = require('express');
var mongoose = require('mongoose');
var User = mongoose.model('User');

/ * CRUD API */
// POST
exports.createUser = function (req, res) {
    // Create a new user document
    var user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    user.save(function (err, user) {
        if (err) {
            console.log("error creating new user: " + err);
            res.send("Error creating new user");
        } else {
            console.log("POST creating new user: " + user.name);
            res.json(user);
        }
    });
};

// GET
exports.getUser =  function (req, res) {
    User.findOne ({ 'username': req.params.username }, function (err, user) {
        if (err) {
            console.log("Error retrieving user: " + err);
            res.send("Error retrieving user");
        } else {
            console.log("GET user with ID: " + user.id);
            res.json(user);
        }
    });
};

// PUT
exports.updateUser = function(req, res) {
    var newUsername = req.body.username;
    var newPassword = req.body.password;
    var newEmail = req.body.email;

    User.findById(req.params.id, function (err, user) {
        if (err) {
            console.log("error retrieving user: " + err);
            res.send("Error retrieving user");
        } else {
            if (user.name != newUsername) user.name = newUsername;
            if (user.password != newPassword) user.password = newPassword;

            user.save(user, function(err, userId) {
                if (err) {
                    console.log("error updating the user: " + err);
                    res.send("error updating the user");
                } else {
                    console.log("UPDATE user with id: " + userId);
                    req.session.regenerate(function() {
                        req.session.user = user;
                        req.session.success = "Update successful";
                        res.redirect("/");
                    });
                }
            });
        }
    });
};

// DELETE
exports.deleteUser = function (req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            console.log("Error finding user to delete: " + err);
            res.send("Error finding user to delete");
        } else {
            User.remove({ _id: user._id }, function (err) {
                if (err) {
                    console.log("Error deleting user: " + err);
                    res.send("Error deleting user");
                } else {
                    console.log("Succesfully deleted user with id: " + user._id);
                    res.send("Successfully deleted user");
                }
            });
        }
    });
};
