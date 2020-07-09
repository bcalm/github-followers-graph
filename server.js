const express = require('express');
const app = express();
const followerDetails = require('./lib/followerDetails');
const port = process.env.port || 8080;
const redis = require('redis');

const redisClient = redis.createClient({ db: 1 });

app.use((req, res, next) => {
  console.log(`${req.url} ${req.method}`);
  next();
});

app.get('/status/:id', (req, res) => {
  followerDetails.get(redisClient, req.params.id).then((status) => {
    res.send(status);
    res.end();
  });
});

app.post('/findConnection/:src/:target/:level', (req, res) => {
  followerDetails.addDetails(redisClient, req.params).then((job) => {
    redisClient.rpush('queue', job.id, (err, res) => {
      console.log('Added to the queue', job.id);
    });
    res.send(`{id: ${job.id}}\n`);
    res.end();
  });
});

app.listen(port, () => console.log(`app is listening on port ${port}`));
