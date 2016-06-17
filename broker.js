/**
 * Created by Mordekaiser on 16/06/16.
 */
var mosca = require('mosca');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./server/config/configuration')[env];
require('./server/config/mongoose')(config);
var auth = require('./server/controllers/authenticateCtrl');

var pubsubsettings = {
    type: 'mongo',
    url: config.db,
    mongo: {}
};

var moscaSettings = {
    port: 1883,
    backend: pubsubsettings
};

// Accepts the connection if the username and password are valid
var authenticate = auth;

// In this case the client authorized as alice can publish to /users/alice taking
// the username from the topic and verifying it is the same of the authorized user
var authorizePublish = function(client, topic, payload, callback) {
    callback(null, client.user == topic.split('/')[0]);
};

// In this case the client authorized as alice can subscribe to /users/alice taking
// the username from the topic and verifying it is the same of the authorized user
var authorizeSubscribe = function(client, topic, callback) {
    console.log('Topic: ');
    console.log(topic);
    console.log(topic.split('/')[0]);
    // return in the callback true if the client.user is equal to the user send in the topic
    callback(null, client.user == topic.split('/')[0]);
};

var server = new mosca.Server(moscaSettings);
server.on('ready', setup);

server.on('clientConnected', function (client) {
    console.log('client connected, id: ', client.id);
});

// The publish() function allows to programatically publish a value to MQTT clients
server.on('published', function(packet, client) {
    console.log('Published', packet.payload);
});

function setup() {
    server.authenticate = authenticate;
    server.authorizePublish = authorizePublish;
    server.authorizeSubscribe = authorizeSubscribe;
    console.log('Mosca broker is up and running');
}