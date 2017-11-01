var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var blogSchema = new Schema({
//   title:  String,
//   author: String,
//   body:   String,
//   comments: [{ body: String, date: Date }],
//   date: { type: Date, default: Date.now },
//   hidden: Boolean,
//   projectdetails: {
//     votes: Number,
//     favs:  Number
//   }
// });


// var Blog = mongoose.model('ProjectData', blogSchema);
var candidateSchema = new Schema({

    _id : Schema.ObjectId,
    CandidateName :String,
    EducationDescription : String,
    CurrentCompanyName : String,
    DesignationId :String,
    Experience : String,
    TeamSize : Number,
    ProjectCount : Number,
    KnowledgeDescription : String,
    WorkDescription : String,
    DomainId : String,
    ApplicationId : String,
    OperatingSystemId : String,
    TechnologyId : String,
    FrameworkId : String,
    LanguageId : String,
    DatabaseId : String,
    IsActive : Boolean,
    IsDelete : { type: Boolean, default: false },
    projectdetails : [
        {
            _id : Schema.ObjectId,
            CandidateId : Schema.ObjectId,
            ProjectId :Schema.ObjectId,
            RoleId : Schema.ObjectId,
            Responsibilities : String,
        }
    ]
});

module.exports = mongoose.model('Demo', candidateSchema);
