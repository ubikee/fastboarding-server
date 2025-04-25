const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

let mongod, client, db;

async function startMemoryDb() {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  client = new MongoClient(uri);

  await client.connect();
  db = client.db('jobsDb');

  console.log('🧠 In-memory MongoDB connected');
}

function getDb() {
  if (!db) throw new Error('Database not initialized');
  return db;
}

async function stopMemoryDb() {
  await client.close();
  await mongod.stop();
}

module.exports = {
  startMemoryDb,
  getDb,
  stopMemoryDb
};

