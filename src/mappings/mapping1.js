const mapping = {
    'order.id': 'order.$.id',
    'client.name': 'order.customer.name',
    'client.code': 'order.customer.$.code',
    'dimensions.width': 'order.size.width',
    'dimensions.height': 'order.size.height',
    'dimensions.unit': 'order.size.width.$.unit',
};

module.exports = {
    mapping
};