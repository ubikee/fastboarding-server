// /domain/jobs/JobsRepository.js
const { getDb } = require('../../db/memoryClient');

class JobsRepository {
  constructor() {
    this.collectionName = 'jobs';
  }

  async create(jobData) {
    const db = getDb();
    const result = await db.collection(this.collectionName).insertOne(jobData);
    return { ...jobData, _id: result.insertedId };
  }

  async findById(id) {
    const db = getDb();
    const objectId = typeof id === 'string' ? new (await import('mongodb')).ObjectId(id) : id;
    return await db.collection(this.collectionName).findOne({ _id: objectId });
  }

  async list(filter = {}) {
    const db = getDb();
    return await db.collection(this.collectionName).find(filter).toArray();
  }

  async delete(id) {
    const db = getDb();
    const objectId = typeof id === 'string' ? new (await import('mongodb')).ObjectId(id) : id;
    return await db.collection(this.collectionName).deleteOne({ _id: objectId });
  }

  async update(id, updateData) {
    const db = getDb();
    const objectId = typeof id === 'string' ? new (await import('mongodb')).ObjectId(id) : id;
    await db.collection(this.collectionName).updateOne({ _id: objectId }, { $set: updateData });
    return this.findById(objectId);
  }
}

module.exports = new JobsRepository();