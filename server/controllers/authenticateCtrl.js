/**
 * Created by Mordekaiser on 16/06/16.
 */
"use strict";
var encrypt = require('../utilities/encryption'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    config = require('../config/configuration');

module.exports = function(client, username, password, callback) {
    console.log('Authenticating client');
    var authorized = false;
    User.findOne({username: username}, function (err, user) {
        if(err) {
            console.log('Error finding user, error: ' + err);
            callback(null, authorized);
        }
        if(!user) {
            console.log('User not found');
            callback(null, authorized)
        }
        else if(password) {
            if(encrypt.hashPwd(user.salt, password.toString()) === user.hashed_pwd) {

                authorized = true;
                if (authorized) client.user = user.username;
                callback(null, authorized);

            } else {
                console.log('Incorrect password');
                callback(null, authorized)
            }
        } else {
            console.log('Missing password');
            callback(null, authorized)
        }
    });
};