var mongoose = require('mongoose');
var schema = mongoose.Schema;

var permissionModuleSchema = new schema({
  _id: { type: schema.ObjectId, default: null },
  ParentPermissionModuleId: schema.ObjectId,
  PermissionModuleName: String,
  DisplayName: String,
  IsActive : Boolean
});

module.exports = mongoose.model('PermissionModule', permissionModuleSchema);