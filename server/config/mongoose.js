/**
 * Created by Mordekaiser on 16/06/16.
 */
var mongoose = require('mongoose'),
    userModel = require('../models/User');

module.exports = function (config) {
    mongoose.connect(config.db);
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback() {
        console.log('Broker db opened');
    });

    userModel.createDefaultUsers();
};