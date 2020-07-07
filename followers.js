const https = require('https');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const getHeaders = () => ({
  'User-Agent': 'node.js',
  authorization: `token ${GITHUB_TOKEN}`,
});

const getGithubOptions = (userName) => ({
  host: 'api.github.com',
  path: `/users/${userName}/followers`,
  headers: getHeaders(),
});

const getFollower = function (userName) {
  return new Promise((resolve, reject) => {
    let data = '';
    const options = getGithubOptions(userName);
    https.get(options, (res) => {
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        const followers = JSON.parse(data).map((followerDetail) => followerDetail.login);
        resolve(followers);
      });
    });
  });
};

const getAllUniqueFollowers = async function (followers, visited, graph) {
  let allFollowers = [];
  for (let i = 0; i < followers.length; i++) {
    if (!visited.includes(followers[i])) {
      let f = await getFollower(followers[i]);
      visited.push(followers[i]);
      graph[followers[i]] = f;
      allFollowers.push(...f);
    }
  }
  allFollowers = [...new Set(allFollowers)];
  return allFollowers;
};

const getFollowers = async function (src, level) {
  const visited = [];
  const graph = {};
  let followers = await getFollower(src);
  graph[src] = followers;
  visited.push(src);

  while (level) {
    followers = await getAllUniqueFollowers(followers, visited, graph);
    level--;
  }
  return graph;
};

const main = function (src, dest, level) {
  getFollowers(src, level).then((graph) => console.log(Object.keys(graph)));
};

main('bcalm', 'mildshower', 2);
