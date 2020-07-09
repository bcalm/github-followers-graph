const { visitDfs } = require('../lib/followers.js');
const { completeProcessing, get, getJob } = require('../lib/followerDetails');
const redis = require('redis');

const redisClient = redis.createClient({ db: 1 });

const runLoop = () => {
  getJob(redisClient, 'DFTQueue')
    .then((id) => {
      console.log(`Picked job: ${id}`);
      get(redisClient, id)
        .then(({ src, level }) =>
          visitDfs(src, level).then((path) => completeProcessing(redisClient, id, path))
        )
        .then(runLoop);
    })
    .catch((err) => {
      console.log(err);
      setTimeout(() => {
        runLoop();
      }, 1000);
    });
};

runLoop();
