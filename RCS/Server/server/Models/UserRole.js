var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userRoleSchema = new schema({
  _id: { type: schema.ObjectId, default: null },
  UserId: [{ type: schema.ObjectId, ref: 'User' }],
  RoleId: [{ type: schema.ObjectId, ref: 'Role' }]
});

module.exports = mongoose.model('UserRole', userRoleSchema);