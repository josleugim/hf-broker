/**
 * Created by Mordekaiser on 16/06/16.
 */
"use strict";
var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    encrypt = require('../utilities/encryption');

var UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: 'Nombre requerido'
    },
    lastName: {
        type: String,
        required: 'Apellidos requeridos'
    },
    username: {
        type: String,
        unique: true,
        required: 'Nombre de usuario requerido'
    },
    email: {
        type: String,
        required: 'Email requerido',
        unique: true
    },
    salt: {
        type: String,
        required: 'Required'
    },
    hashed_pwd: {
        type: String,
        required: 'Required'
    },
    roles: [{
        type: String,
        required: 'Required'
    }]
});

UserSchema.plugin(timestamps);
var User = mongoose.model('User', UserSchema);

function createDefaultUsers() {
    User.find({}).exec(function (err, collection) {
        if(collection.length === 0) {
            console.log('Seeding database');
            var salt, hash;
            salt = encrypt.createSalt();
            hash = encrypt.hashPwd(salt, 'demo');
            User.create({
                name: 'José Miguel',
                lastName: 'Ramírez',
                username: 'josleugim',
                email: 'josleugim@gmail.com',
                salt: salt,
                hashed_pwd: hash,
                roles: ['owner']
            }, function (err) {
                if(err)
                    console.log(err);
            });
        }
    })
}

exports.createDefaultUsers = createDefaultUsers;