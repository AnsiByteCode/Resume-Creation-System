var mongoose = require('mongoose');
var schema = mongoose.Schema;

var candidateSchema = new schema({
    CandidateName: String,
    EducationDescription: String,
    CurrentCompanyName: String,
    Experience: String,
    TeamSize: Number,
    ProjectCount: Number,
    KnowledgeDescription: String,
    WorkDescription: String,
    DomainId: [{type:schema.ObjectId,ref : 'Domain'}],
    ApplicationId: [{type:schema.ObjectId,ref : 'Application'}],
    OperatingSystemId: [{type:schema.ObjectId,ref : 'OperatingSystem'}],
    TechnologyId: [{type:schema.ObjectId,ref : 'Technology'}],
    FrameworkId: [{type:schema.ObjectId}],
    LanguageId: [{ type: schema.ObjectId, ref: 'Language' }],
    DatabaseId: [{ type: schema.ObjectId, ref: 'Database' }],
    DesignationId: [{ type: schema.ObjectId, ref: 'Designation' }],
    IsActive: Boolean,
    IsDelete: { type: Boolean, default: false }
});

module.exports = mongoose.model('Candidate', candidateSchema);
