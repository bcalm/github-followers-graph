const { getShortestPath } = require('./lib/followers.js');
const followerDetails = require('./lib/followerDetails');
const redis = require('redis');

const redisClient = redis.createClient({ db: 1 });

const getJob = () => {
  return new Promise((resolve, reject) => {
    redisClient.blpop('queue', 1, (err, res) => {
      if (res) resolve(res[1]);
      else reject('no job');
    });
  });
};

const runLoop = () => {
  getJob()
    .then((id) => {
      console.log(`Picked job: ${id}`);
      followerDetails
        .get(redisClient, id)
        .then(({ src, target, level }) =>
          getShortestPath(src, target, level).then((path) =>
            followerDetails.completeProcessing(redisClient, id, path)
          )
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
