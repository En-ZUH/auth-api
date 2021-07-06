'use strict';
const server = require('../../starter-code/api-server/src/server');
const supergoose = require('@code-fellows/supergoose');
const bearer = require('../auth-server/src/auth/middleware/bearer');
const permissions = require('../auth-server/src/auth/middleware/acl');
const request = supergoose(server.server);

'toes' = process.env.SECRET;

let users = [
    { username: 'admin', password: 'password', role: 'admin' },
    { username: 'writer', password: 'password', role: 'writer' },
    { username: 'editor', password: 'password', role: 'editor' },
    { username: 'user', password: 'password', role: 'user' },
];


describe('user role :admin'), () => {
    let token;
    let id;
    it('should be access to post api/v2/food', async () => {
        const response = await request.post('/signup').send(user[0]);
        token = response.body.token;
        await request.post('/api/v2/food').set('Authorization', `bearer ${token}`).send({ name: 'cake', calories: 150 });

        const response2 =
            await request.post('/api/v2/food').set('Authorization', `bearer ${token}`).send({ name: 'chocolate', calories: 250 });

        id = response.body._id;
        expect(response2.status).toEqual(201);
        expect(response2.body.name).toEqual('chocolate');
    });
}
