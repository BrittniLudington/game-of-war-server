
const app = require('../src/server');

describe('App', () =>
{
    it('GET / responds with 200 containing "Hello, World!"', () =>
    {
        return supertest(app).get('/').expect(200, 'files for users, games for games');
    });
})
