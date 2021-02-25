const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    /*------------------------------------------------------ */
    app = express(),
    loginCtrl = require('./src/controller/login'),
    userCtrl = require('./src/controller/user'),
    port = process.env.PORT || 3000,
    axios = require('axios').default,
    CronJob = require('cron').CronJob;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    //res.setHeader('Content-Type', 'application/json')
    next();
});

app.use(express.static('public'));

app.use(cors())

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError')
        res.status(401).send('Missing authentication credentials.');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
});

app.post('/login', loginCtrl.login); //Login
app.post('/register', userCtrl.register); //Inscription
app.get('/users', userCtrl.getUtilisateurs); //recuperation des utilisateurs
app.get('/user/:id', userCtrl.getUtilisateur); //recuperation l'utilisateur unique
app.put('/user/:id', userCtrl.updateUtilisateur); // Update de l'utilisateur
app.delete('/deleteUser/:id', userCtrl.deleteUtilisateur); //Supprimer l'utilisateur

app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname + '/error.html'))
});

app.listen(port, () => console.log(`App listening on port ` + port))
