//test.js

const server = require('./app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(server);

describe('User Endpoints', () => {

    it('GET /user should show all users', async () => {
        const res = await requestWithSupertest.get('/api/users');

        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(res.body).toHaveProperty('users')
        expect(res.body.users.length > 0)
        expect(res.body.users[0]).toHaveProperty('id')
        expect(res.body.users[0]).toHaveProperty('login')
        expect(res.body.users[0]).toHaveProperty('fio')
        expect(res.body.users[0]).toHaveProperty('role_label')
    });

});

describe('clint endpoints', () =>{
    it('get all clients', async () => {
        const res = await requestWithSupertest.get('/api/clients')
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(res.body).toHaveProperty('clients')
        expect(res.body.clients[0]).toHaveProperty('id')
        expect(res.body.clients[0]).toHaveProperty('label')
    })
    it('create a client', async () => {
        const res = await requestWithSupertest.post('/api/clients').send({label:'test'})
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));

    })
    it('delete a client by id', async () => {
        const res = await requestWithSupertest.delete('/api/clients/4')
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));

    })
    it('get one client by id', async () => {
        const res = await requestWithSupertest.get('/api/clients/1')
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('label')
    })
})

describe('orders endpoints', () =>{
    it('get all orders', async () => {
        const res = await requestWithSupertest.get('/orders')
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('html'));
    })
    it('create a order', async () => {
        const res = await requestWithSupertest.post('/orders/create').send({label:'test', id_client:1, id_status:10, amount: 1000 });
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    })
    it('get one orders', async () => {
        const res = await requestWithSupertest.get('/orders/1')
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('html'));
    })
})
describe('payments endpoints', () =>{
    it('get all payments', async () => {
        const res = await requestWithSupertest.get('/payments')
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('html'));

    })
})