'use strict';
require('dotenv').config();
require('@code-fellows/supergoose');
let superTest = require('supertest');
let server = require('../src/server');
let mockReq = superTest(server.app);

const users = {
    admin: { username: 'test1', password: 'test', role: 'admin' },
    editor: { username: 'test2', password: 'test', role: 'editor' },
    user: { username: 'test3', password: 'test', role: 'user' },
};

describe('sign-up sign-in', () => {
    Object.keys(users).forEach(user => {
        it('sign up', async () => {
            let res = await mockReq.post('/signup').send(users[user]);
            expect(res.status).toEqual(201);
            expect(res.body.token).toBeDefined();
            expect(res.body.user._id).toBeDefined();
            expect(res.body.user.username).toEqual(users[user].username);
        });

        it('sign in', async () => {
            let res = await mockReq.post('/signin').auth(users[user].username, users[user].password);
            expect(res.status).toEqual(200);
            expect(res.body.token).toBeDefined();
            expect(res.body.user._id).toBeDefined();
            expect(res.body.user.username).toEqual(users[user].username);
        });
    });
});

describe('/users + /secret', () => {
    it('/secret', async () => {
        let res = await mockReq.post('/signin').auth(users.user.username, users.user.password);
        const token_1 = res.body.token;
        let res2 = await mockReq.get('/secret').set(`Authorization`, `Bearer ${token_1}`);
        expect(res2.status).toEqual(200);
        expect(res2.text).toEqual('Welcome to the secret area');
    });

    it('/users', async () => {
        let res1 = await mockReq.post('/signin').auth(users.admin.username, users.admin.password);
        const token_2 = res1.body.token;
        let res = await mockReq.get('/users').set({ Authorization: `Bearer ${token_2}` });
        expect(res.status).toEqual(200);
        expect(res.body.length).toEqual(3);
    });
});