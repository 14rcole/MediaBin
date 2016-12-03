var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

/ * CRUD API */
// POST
router.post('/user/new', function (req, res) {
    // Create a new user document
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }, function (err, user) {
        if (err) {
            console.log("error creating new user: " + err);
            res.send("Error creating new user");
        } else {
            console.log("POST creating new user: " + user._id);
            res.json(user);
        }
    });
});

// GET
router.get('/user/:username', function (req, res) {
    User.findOne ({ 'username': req.params.username }, function (err, user) {
        if (err) {
            console.log("Error retrieving user: " + err);
            res.send("Error retrieving user");
        } else {
            console.log("GET user with ID: " + user._id);
            res.json(user);
        }
    });
});

// PUT
router.put('/user/:id/edit', function(req, res) {
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
});

// DELETE
router.delete('/user/:id', function (req, res) {
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
});
