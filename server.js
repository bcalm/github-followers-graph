const express = require('express');
const app = express();
const followerDetails = require('./followerDetails');
const port = process.env.port || 8080;
const redis = require('redis');

const redisClient = redis.createClient({ db: 1 });

app.use((req, res, next) => {
  console.log(`${req.url} ${req.method}`);
  next();
});

app.post('/findConnection/:src/:target/:depth', (req, res) => {
  console.log(req.params);
  followerDetails.addDetails(redisClient, req.params).then((job) => {
    console.log(job);
    redisClient.rpush('queue', job.id, (err, res) => {
      console.log('Added to the queue', job.id);
    });
    res.send(`${job.id}`);
    res.end();
  });
});

app.listen(port, () => console.log(`app is listening on port ${port}`));
