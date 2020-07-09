const http = require('http');
const vorpal = require('vorpal')();

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

vorpal
  .command('shortest-path <src> <target> <level>')
  .description('find the path between two users')
  .autocomplete(['src', 'target', 'level'])
  .alias('sp')
  .action((args, cb) => {
    const { src, target, level } = args;
    const path = `/findConnection/${src}/${target}/${level}`;
    sendRequest(path, 'POST').then((res) => {
      console.log(res);
      cb();
    });
  });

vorpal
  .command('status <jobId>')
  .description('for checking the current status of a job')
  .autocomplete(['jobId'])
  .action((args, cb) => {
    const { jobId } = args;
    const path = `/status/${jobId}`;
    sendRequest(path, 'GET').then((res) => {
      console.table(JSON.parse(res));
      cb();
    });
  });

vorpal.delimiter('github-follower$').show();
