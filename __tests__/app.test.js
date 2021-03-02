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
      //.expect(200);

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
        // {
        //   'id': 2,
        //   'todo': 'rearrange Netflix queue for Jeff',
        //   'completed': false,
        //   'owner_id': 2,
        // },
        // {
        //   'id': 3,
        //   'todo': 'buy new shirt from Banana Republic',
        //   'completed': false,
        //   'owner_id': 1,
        // },
        // {
        //   'id': 4,
        //   'todo': 'construct robotic gauntlet from foil and foam',
        //   'completed': false,
        //   'owner_id': 2,
        // },
        // {
        //   'id': 5,
        //   'todo': 'look at self in mirror',
        //   'completed': false,
        //   'owner_id': 1,
        // },
        // {
        //   'id': 6,
        //   'todo': 'watch Korean remake of The Cape',
        //   'completed': false,
        //   'owner_id': 2,
        // },
        // {
        //   'id': 7,
        //   'todo': 'have chest waxed',
        //   'completed': false,
        //   'owner_id': 1,
        // },
        // {
        //   'id': 8,
        //   'todo': 'buy used Judge Dredd costume',
        //   'completed': false,
        //   'owner_id': 2,
        // }
      ];

      const data = await fakeRequest(app)
        .get('/api/plans')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });




  });
});
