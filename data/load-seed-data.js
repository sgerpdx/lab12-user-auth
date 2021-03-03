const client = require('../lib/client');
const { plans } = require('./plans.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash, name)
                      VALUES ($1, $2, $3)
                      RETURNING *;
                  `,
          [user.email, user.hash, user.name]);
      })
    );

    const user = users[0].rows[0];


    await Promise.all(
      plans.map(plan => {
        return client.query(`
                    INSERT INTO plans (todo, completed, owner_id)
                    VALUES ($1, $2, $3);
                `,
          [plan.todo, plan.completed, plan.owner_id]);
      })
    );


    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch (err) {
    console.log(err);
  }
  finally {
    client.end();
  }

}
