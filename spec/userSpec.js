const request = require('supertest');

describe('Login test by rest API', () => {
    // test permettant de tester si les variables sont bien rempli ou non
    it('Login fail email/password undefined', (done) => {
        request('https://api-develop-ci.herokuapp.com')
            .post('/login')
            .send('email=&password=')
            .set('Accept', 'application/json')
            .expect(403, {
                error: true,
                message: "L'email/password est manquant"
            }, done);
    });

    // test permettant de tester si les variables sont bien conforme ou non
    it('Login fail bad email', (done) => {
        request('https://api-develop-ci.herokuapp.com')
            .post('/login')
            .send('email=unknown&password=unknown')
            .set('Accept', 'application/json')
            .expect(408, {
                error: true,
                message: "L'email n'est pas conforme"
            }, done);
    });
})