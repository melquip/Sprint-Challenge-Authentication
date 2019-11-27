const db = require('../database/dbConfig');
const request = require('supertest');
const server = require('./server');

let user;
beforeEach(() => {
  return db('users').truncate();
});

describe('server', () => {
  describe('[POST] /api/auth/register', () => {
    it('is in testing environment', () => {
      expect(process.env.NODE_ENV).toBe('testing');
    });
    it('adds user', () => {
      return request(server).post('/api/auth/register')
        .send({ username: "melqui", password: "melqui" })
        .expect(201)
    });
    it('adds user and gets correct response', () => {
      return request(server).post('/api/auth/register')
        .send({ username: "melqui", password: "melqui" })
        .expect({ id: 1, username: "melqui" })
    });
  });
  describe('[POST] /api/auth/login', () => {
    it('is in testing environment', () => {
      expect(process.env.NODE_ENV).toBe('testing');
    });
    it('can login with correct credentials', async () => {
      try {
        user = { username: "melqui", password: "melqui" };
        await request(server).post('/api/auth/register')
          .send(user)
          .expect(201)
          .expect({ id: 1, username: "melqui" });
        await request(server).post('/api/auth/login')
          .send(user)
          .expect(200)
      } catch (error) {
        console.error('Error while testing [POST] /api/auth/login -> can login with correct credentials ->', error);
      }
    });
    it('can\'t login without password', async () => {
      try {
        user = { username: "melqui", password: "melqui" };
        await request(server).post('/api/auth/register')
          .send(user)
          .expect({ id: 1, username: "melqui" });
        await request(server).post('/api/auth/login')
          .send({ username: "melqui" })
          .expect(401);
      } catch (error) {
        console.error('Error while testing [POST] /api/auth/login -> can\'t login without password ->', error);
      }
    });
  });
  describe('[POST] /api/jokes', () => {
    it('is in testing environment', () => {
      expect(process.env.NODE_ENV).toBe('testing');
    });
    it('gets 200 OK when logged in', async () => {
      try {
        user = { username: "melqui", password: "melqui" };
        await request(server).post('/api/auth/register')
          .send(user).expect(201);
        let login = await request(server).post('/api/auth/login')
          .send(user).expect(200);
        const jokes = await request(server).get('/api/jokes')
          .set({ Authorization: login.body.token });
        expect(jokes.body.length).toBeGreaterThan(0);
      } catch (error) {
        console.error('Error while testing [POST] /api/jokes -> gets 200 OK when logged in ->', error);
      }
    });
    it('gets blocked if not logged in', async () => {
      try {
        await request(server).post('/api/jokes').expect(401);
      } catch (error) {
        console.error('Error while testing [POST] /api/jokes -> gets blocked if not logged in ->', error);
      }
    });
  });
});