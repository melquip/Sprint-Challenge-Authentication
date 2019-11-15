const db = require('../database/dbConfig');

const getUser = (filter) => {
  return db('users').where(filter).first();
}

const add = (user) => {
  return db('users').insert(user).then((ids) => getUser({ id: ids[0] }));
}

module.exports = {
  getUser,
  add
}