var mongoose = require('mongoose');
var schema = mongoose.Schema;

var projectSchema = new schema({
    ProjectName: String,
    TeamSize: Number,
    Description: String,
    OtherTools: String,
    DomainId: [{ type: schema.ObjectId, ref: 'Domain' }],
    OperatingSystemId: [{ type: schema.ObjectId, ref: 'OperatingSystem' }],
    TechnologyId: [{ type: schema.ObjectId, ref: 'Technology' }],
    DatabaseId: [{ type: schema.ObjectId, ref: 'Database' }],
    IsActive: Boolean,
    IsDelete: { type: Boolean, default: false }
});

module.exports = mongoose.model('Project', projectSchema);