const request = require('supertest');

describe('Login test by rest API', () => {
    // test permettant de tester si les variables sont bien rempli ou non
    it('Login fail datas manquantes', (done) => {
        request('https://api-develop-ci.herokuapp.com')
            .post('/register')
            .send('')
            .set('Accept', 'application/json')
            .expect(403, {
                error: true,
                message: "L'une ou plusieurs données obligatoire sont manquantes"
            }, done);
    });

})