var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userPermissionSchema = new schema({
  _id: { type: schema.ObjectId, default: null },
  UserId: [{ type: schema.ObjectId, ref: 'User' }],
  PermissionModuleId: [{ type: schema.ObjectId, ref: 'PermissionModule' }],
  ModuleKey: String
});

module.exports = mongoose.model('UserPermission', userPermissionSchema);