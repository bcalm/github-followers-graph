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

const findShortestPathDFS = (graph, source, target, visited = new Set()) => {
  visited.add(source);
  const neighbors = graph[source] ? graph[source] : [];
  const paths = [];
  for (const node of neighbors) {
    if (node === target) {
      return [source, target];
    }
    if (!visited.has(node)) {
      const path = findShortestPathDFS(graph, node, target, visited);
      if (path) paths.push([source, ...path]);
    }
  }

  if (paths.length > 0) {
    return paths.reduce((path1, path2) => (path1.length <= path2.length ? path1 : path2));
  }
  return null;
};

const main = async function (src, target, level) {
  const graph = await getFollowers(src, level);
  const shortestPath = findShortestPathDFS(graph, src, target);
  console.log(shortestPath);
};

main('bcalm', 'MahaVadeghar', 2);
