require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;

    beforeAll(async done => {
      execSync('npm run setup-db');

      client.connect();

      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'craig@greendale.edu',
          password: '4444',
          name: 'Craig'
        });

      token = signInData.body.token; // eslint-disable-line
      console.log(token);
      return done();
    });

    afterAll(done => {
      return client.end(done);
    });


    test('creates new plan', async () => {

      const newPlan = {
        'id': 3,
        'todo': 'eat breakfast',
        'completed': false,
        'owner_id': 2,
      };

      const data = await fakeRequest(app)
        .post('/api/plans')
        .send(newPlan)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(newPlan);
    });


    test('returns plans', async () => {

      const expectation = [
        {
          'id': 3,
          'todo': 'eat breakfast',
          'completed': false,
          'owner_id': 2,
        },
      ];

      const data = await fakeRequest(app)
        .get('/api/plans')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });


    test('updates existing plan object', async () => {

      const newPlan = {
        id: 3,
        todo: 'eat breakfast',
        completed: true,
        owner_id: 2,
      };

      const expectedPlan = {
        ...newPlan,
      }

      const updatedNewPlan = await fakeRequest(app)
        .put('/api/plans/3')
        .set('Authorization', token)
        .send(newPlan)
        .expect('Content-Type', /json/)
        .expect(200);
      console.log(updatedNewPlan.body);

      const updatedPlan = await fakeRequest(app)
        .get('/api/plans')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(updatedPlan.body).toEqual([expectedPlan]);
    });


  });
});
