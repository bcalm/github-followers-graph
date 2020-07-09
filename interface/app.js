const http = require('http');
const vorpal = require('vorpal')();

const getServerOptions = (src, target, level) => ({
  host: 'localhost',
  port: 8080,
  method: 'POST',
  path: `/findConnection/${src}/${target}/${level}`,
});

const sendRequest = (src, target, level) => {
  const options = getServerOptions(src, target, level);
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
    sendRequest(src, target, level).then((res) => {
      console.log(res);
      cb();
    });
  });

vorpal.delimiter('github-follower$').show();
