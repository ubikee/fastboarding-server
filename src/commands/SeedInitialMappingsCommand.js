const CreateClientMappingCommand = require('./CreateClientMappingCommand');

async function SeedInitialMappingsCommand() {
  await CreateClientMappingCommand('acme', {
    'job.id': 'order.$.id',
    'client.name': 'order.customer.name',
    'client.code': 'order.customer.$.code',
    'details.dimensions.width': 'order.size.width',
    'details.dimensions.unit': 'order.size.width.$.unit'
  });

  console.log('✅ Initial mappings seeded');
}

module.exports = SeedInitialMappingsCommand;