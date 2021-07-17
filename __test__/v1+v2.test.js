'use strict';
require('@code-fellows/supergoose');
let superTest = require('supertest');
const server = require('../src/server');
const mockReq = superTest(server.app);



describe('admin', () => {
  let token;
  let id;

  it('sign up', async () => {
    const res = await mockReq.post('/signup').send({ username: 'testing-user', password: 'testing-password', role: 'admin' });
    expect(res.status).toEqual(201);
  });

  it('sign in', async () => {
    const res = await mockReq.post('/signin').auth('testing-user', 'testing-password');
    const token_1 = res.body.token;
    expect(res.status).toEqual(200);
    expect(res.body.user.role).toEqual('admin');
    expect(res.body.token).toEqual(token_1);
  });

  it('POST', async () => {
    const res = await mockReq.post('/api/v1/food').send({
      name: 'apple',
      calories: 60,
      type: 'FRUIT',
    }).set({ Authorization: `Bearer ${token}` });
    expect(res.status).toEqual(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.name).toEqual('apple');
    expect(res.body.type).toEqual('FRUIT');
    id = res.body._id;
  });

  it('GET all', async () => {
    const res = await mockReq.get('/api/v1/food');
    expect(res.status).toEqual(200);
    expect(res.body[0]._id).toBeDefined();
    expect(res.body[0].name).toEqual('apple');
    expect(res.body[0].type).toEqual('FRUIT');
    expect(res.body.length).toEqual(1);
  });

  it('GET one', async () => {
    const res = await mockReq.get(`/api/v1/food/${id}`);
    expect(res.status).toEqual(200);
    expect(res.body._id).toBeDefined();
    expect(res.body.name).toEqual('apple');
    expect(res.body.type).toEqual('FRUIT');
    expect(res.body._id).toEqual(id);
  });

  it('PUT', async () => {
    const res = await mockReq.put(`/api/v1/food/${id}`).send({
      name: 'tomato',
      calories: 500,
      type: 'VEGETABLE',
    }).set({ 'Authorization': `Bearer ${token}` });
    expect(res.status).toEqual(200);
    expect(res.body._id).toBeDefined();
    expect(res.body.name).toEqual('tomato');
    expect(res.body.type).toEqual('VEGETABLE');
    expect(res.body.calories).not.toEqual(60);
    expect(res.body._id).toEqual(id);
  });

  it('DELETE', async () => {
    const res = await mockReq.delete(`/api/v1/food/${id}`).set({ 'Authorization': `Bearer ${token}` });
    expect(res.status).toEqual(200);
    const res1 = await mockReq.get(`/api/v1/food/${id}`);
    expect(res1.status).toEqual(200);
    expect(res1.body).toEqual(null);
    const res2 = await mockReq.get('/api/v1/food/');
    expect(res2.body.length).toEqual(0);
  });
});