// /domain/mappings/MappingsRepository.js
const { getDb } = require('../../database/MongoMemoryClient'); 

/**
 * Repository for managing client mappings in the database.
 * This class provides methods to find, insert, update, and list mappings.
 */
class MappingsRepository {
    constructor() {
        this.collectionName = 'clientMappings';
    }

    async findByClientId(clientId) {
        const db = getDb();
        return await db.collection(this.collectionName).findOne({ clientId });
    }

    async insertMapping(clientId, mapping) {
        const db = getDb();
        return await db.collection(this.collectionName).insertOne({ clientId, mapping });
    }

    async updateMapping(clientId, mapping) {
        const db = getDb();
        return await db.collection(this.collectionName).updateOne(
            { clientId },
            { $set: { mapping } },
            { upsert: true }
        );
    }

    async listAll() {
        const db = getDb();
        return await db.collection(this.collectionName).find().toArray();
    }
}

module.exports = new MappingsRepository();