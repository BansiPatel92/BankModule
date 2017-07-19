var Client = require('mariasql');
var settings = {
    host: '127.0.0.1',//'52.32.30.195',
    port: 3307,
    user: 'root',
    password: '',//'$uPpeF!nP@ssw0rd!',
    db: 'rupeefin',
    multiStatements: true
};
var connection = new Client(settings);
module.exports = connection;