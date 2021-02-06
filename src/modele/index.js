const config = require('../../config');

mysql = require('mysql'),
    bdd = mysql.createConnection({
        multipleStatements: true,
        host: config.BDD_HOST | process.env.BDD_HOST, //
        user: config.BDD_USER | process.env.BDD_USER, //
        password: config.BDD_PASSWORD | process.env.BDD_PASSWORD, //
        database: config.BDD_DATABASE | process.env.BDD_DATABASE, //
        port: '3306'
    })

bdd.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected');
})

module.exports = bdd;