var mongoose = require('mongoose');
var schema = mongoose.Schema;

var rolePermissionSchema = new schema({
  _id: { type: schema.ObjectId, default: null },
  RoleId: [{ type: schema.ObjectId, ref: 'Role' }],
  PermissionModuleId: [{ type: schema.ObjectId, ref: 'PermissionModule' }],
  ModuleKey: String
});

module.exports = mongoose.model('RolePermission', rolePermissionSchema);