mysql = require('mysql'),
    bdd = mysql.createConnection({
        multipleStatements: true,
        host: process.env.BDD_HOST, //
        user: process.env.BDD_USER, //
        password: process.env.BDD_PASSWORD, //
        database: process.env.BDD_DATABASE, //
        port: 3306 //
    })

bdd.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected');
})

module.exports = bdd;