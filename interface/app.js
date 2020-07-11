const http = require('http');
const vorpal = require('vorpal')();
const prompts = require('./prompt');

const getServerOptions = (method) => ({
  host: 'localhost',
  port: 8080,
  method,
});

const sendRequest = (path, method) => {
  const options = getServerOptions(method);
  options.path = path;
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve(data);
      });
    });
    req.end();
  });
};

vorpal.delimiter('github-follower$').show();

vorpal
  .command('shortest-connection')
  .description('find the connection between two users')
  .alias('sc')
  .action(function (argument, callback) {
    this.prompt(prompts.shortestConnection).then((details) => {
      const { src, target, level } = details;
      const path = `/findConnection/${src}/${target}/${level}`;
      sendRequest(path, 'POST').then((res) => {
        console.log(res);
        callback();
      });
    });
  });

vorpal
  .command('status')
  .description('for checking the current status of a job')
  .action(function (argument, callback) {
    this.prompt(prompts.status).then((details) => {
      const { jobId } = details;
      const path = `/status/${jobId}`;
      sendRequest(path, 'GET').then((res) => {
        res = JSON.parse(res);
        if (res.connection) {
          res.connection = res.connection.split(',').join(' -> ');
          console.log(res.connection);
        } else {
          console.log(res.status, '\r\n');
        }
        callback();
      });
    });
  });

vorpal
  .command('followers')
  .description('for traversing on all the followers of any user')
  .action(function (argument, callback) {
    this.prompt(prompts.followers).then((details) => {
      const { src, level, traverseBy } = details;
      const lookup = {
        'Breadth-first-traversal': 'BFT',
        'Depth-first-traversal': 'DFT',
      };
      const traversalMethod = lookup[traverseBy];
      const path = `/traverse/${traversalMethod}/${src}/${level}`;
      sendRequest(path, 'post').then((res) => {
        console.log(res);
        callback();
      });
    });
  });
