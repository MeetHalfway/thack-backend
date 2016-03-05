// controllers/userController.js

var _ = require("underscore");

var users = require("../data/users.json");

module.exports = function(userId) {
    return {

        /**
         * Return's user data of logged-in user.
         */
        getUserData: function() {
            var user = _.find(users, function(user) {return user._id == userId; });

            var result = _.clone(user);
            if(result.hasOwnProperty("top_friends")){
                delete(result.top_friends);
            }

            return result;
        },

        /**
         * Returns friends of logged-in user.
         *
         * @returns {Array}
         */
        getFriendsList: function() {
            var result = _.find(users, function(user) { return user._id == userId; });

            return result.hasOwnProperty("top_friends") ? result.top_friends : [];
        },

        /**
         * Returns specific friend with given id for logged-in user.
         *
         * @param friendId
         * @returns {object}
         */
        getFriend: function(friendId) {
            var userObject = _.find(users, function(user){ return user._id == userId; });

            if(userObject)
                return _.find(userObject.top_friends, function(friend) { return friend._id == friendId; });

            return null;
        }
    }
};
