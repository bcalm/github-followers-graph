const getCurrId = (client) => {
  return new Promise((res, rej) => {
    client.incr('curr_id', (err, id) => {
      res(id);
    });
  });
};

const createJob = (client, id, detail) => {
  const statusDetails = ['status', 'schedule'];
  const receivingDetails = ['receivedAt', new Date()];
  const details = Object.keys(detail).reduce((list, set) => {
    list.push(set, detail[set]);
    return list;
  }, []);
  const jobDetails = statusDetails.concat(receivingDetails, details);
  return new Promise((resolve, reject) => {
    client.hmset(`job_${id}`, jobDetails, (err, res) => {
      resolve(Object.assign({ id: id }, detail));
    });
  });
};

const addDetails = (client, details) => {
  return getCurrId(client).then((id) => createJob(client, id, details));
};

const get = (client, id) => {
  return new Promise((resolve, rej) => {
    client.hgetall(`job_${id}`, (err, res) => {
      resolve(res);
    });
  });
};

module.exports = { addDetails, get };
