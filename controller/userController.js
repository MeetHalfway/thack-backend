// controllers/userController.js
// Controller for the user search

var Promise = require("es6-promise");
var _ = require("underscore");
var users = require("../mockup/user1.json");
var thisUser = _.find(users, function(user){ return user._id == '356a192b7913b04c54574d18c28d46e6395428ab'; });


module.exports = {

    getUser: function() {
        var result = {};

        user = _.find(users, function(user){return user._id == thisUser._id; });

        result = _.clone(user);
        if(result.top_friends){
            delete(result.top_friends);
        }

        return result
    },

    getFriendsList: function(userID) {
        var result = {};

        if(userID === thisUser){
            result = _.find(users, function(user){ return user._id == userID; });
        } else {
            result = _.find(users, function(user){ return user._id == thisUser._id; });
        }

        return result.top_friends;
    },

    getFriend: function(userID) {
        var result = {};

        result = _.find(users, function(user){ return user._id == userID; });

        return result.top_friends;
    }


};
