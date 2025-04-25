const MappingsRepository = require('../MappingsRepository');

async function CreateClientMappingCommand(clientId, mapping) {
  if (!clientId || typeof mapping !== 'object') {
    throw new Error('Invalid mapping data');
  }

  return await MappingsRepository.updateMapping(clientId, mapping);
}

module.exports = CreateClientMappingCommand;