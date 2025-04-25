const fs = require('fs');
const path = require('path');
const { mapping } = require('../mappings/mapping1');
const { xmlToJob } = require('../parsers/xmlToJob');

/**
 * Executes the XML to job conversion.
 */
async function execute(file) {

    const filePath = path.resolve(__dirname, file); 
    const xmlString = fs.readFileSync(filePath, 'utf8');
    
    try {
        const job = await xmlToJob(xmlString, mapping)
        return job;
    } catch (error) {
        console.error('Error parsing XML:', error);
        throw error;
    }
}

module.exports = {
    execute
};