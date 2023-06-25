const { MongoClient } = require('mongodb');

async function mongoConnect() {
  const url = process.env.MONGO_URL;
  const dbName = process.env.MONGO_DB_NAME;

  const client = await MongoClient.connect(url);
  const db = client.db(dbName);
  return db;
}

module.exports = { mongoConnect };
