const followers = [
  {
    name: 'traverseBy',
    choices: ['Breadth-first-traversal', 'Depth-first-traversal'],
    message: 'Select traverse method: ',
    type: 'list',
    validate: (str) => Boolean(str),
  },
  {
    name: 'src',
    message: 'Enter src:  ',
    type: 'text',
    validate: (str) => Boolean(str),
  },
  {
    name: 'level',
    message: 'Enter level:  ',
    type: 'number',
    validate: (str) => Boolean(str),
  },
];

const shortestConnection = [
  {
    name: 'src',
    message: 'Enter src:  ',
    type: 'text',
    validate: (str) => Boolean(str),
  },
  {
    name: 'target',
    message: 'Enter target:  ',
    type: 'text',
    validate: (str) => Boolean(str),
  },
  {
    name: 'level',
    message: 'Enter level:  ',
    type: 'number',
    validate: (str) => Boolean(str),
  },
];

const status = [
  {
    name: 'jobId',
    message: 'Enter jobId:  ',
    type: 'number',
    validate: (str) => Boolean(str),
  },
];

module.exports = { shortestConnection, followers, status };
