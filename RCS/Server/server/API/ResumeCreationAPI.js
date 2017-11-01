var assert = require('assert');
var officegen = require('officegen');
var fs = require('fs');
var path = require('path');
var ProjectDetails = require('./../Models/ProjectDetails.js');
var ProjectRole = require('./../Models/ProjectRole.js');
var AdmZip = require('adm-zip');
var IMAGEDIR = __dirname + '/../examples/';
var OUTDIR = __dirname + '/../tmp/';
var path = require('path');
mongoose = require('mongoose');
ObjectId = mongoose.Types.ObjectId;
var Candidate = require('./../Models/Candidate.js');
var ProjectDetail = require('./../Models/ProjectDetail.js');
var Application = require('./../Models/Application.js');
var Database = require('./../Models/Database.js');
var Designation = require('./../Models/Designation.js');
var Framework = require('./../Models/Framework.js');
var Domain = require('./../Models/Domain.js');
var OperatingSystem = require('./../Models/OperatingSystem.js');
var Project = require('./../Models/Project.js');
var Technology = require('./../Models/Technology.js');
var Language = require('./../Models/Language.js');
var constants = require('./../Constants/Constants.js');

let resumeCreation = (req, res) => {
ProjectDetail.aggregate([
    {
        '$match': { 'CandidateId' : ObjectId(req.body.CandidateId) }
    },
    { $lookup: {
        from: 'candidates',
        localField: 'CandidateId',
        foreignField: '_id',
        as: 'candidates' }
    },
    { '$unwind': '$candidates' },
    { $lookup: {
        from: 'domains',
        localField: 'candidates.DomainId',
        foreignField: '_id',
        as: 'candidates.domains' }
    },
    { $lookup: {
        from: 'technologies',
        localField: 'candidates.TechnologyId',
        foreignField: '_id',
        as: 'candidates.technologies' }
    },
    { $lookup: {
        from: 'databases',
        localField: 'candidates.DatabaseId',
        foreignField: '_id',
        as: 'candidates.databases' }
    },
    { $lookup: {
        from: 'applications',
        localField: 'candidates.ApplicationId',
        foreignField: '_id',
        as: 'candidates.applications' }
    },
    { $lookup: {
        from: 'frameworks',
        localField: 'candidates.FrameworkId',
        foreignField: '_id',
        as: 'candidates.frameworks' }
    },
    { $lookup: {
        from: 'languages',
        localField: 'candidates.LanguageId',
        foreignField: '_id',
        as: 'candidates.languages' }
    },
    { $lookup: {
        from: 'operatingsystems',
        localField: 'candidates.OperatingSystemId',
        foreignField: '_id',
        as: 'candidates.os' }
    },
    { $lookup: {
        from: 'projectroles',
        localField: 'RoleId',
        foreignField: '_id',
        as: 'projectroles' }
    },
    { $lookup: {
        from: 'projects',
        localField: 'ProjectId',
        foreignField: '_id',
        as: 'projects' }
    },
    { '$unwind': '$projects' },
    { $lookup: {
        from: 'domains',
        localField: 'projects.DomainId',
        foreignField: '_id',
        as: 'projects.domains' }
    },
    { $lookup: {
        from: 'databases',
        localField: 'projects.DatabaseId',
        foreignField: '_id',
        as: 'projects.databases' }
    },
    { $lookup: {
        from: 'operatingsystems',
        localField: 'projects.OperatingSystemId',
        foreignField: '_id',
        as: 'projects.operatingsystems' }
    },
    { $lookup: {
        from: 'technologies',
        localField: 'projects.TechnologyId',
        foreignField: '_id',
        as: 'projects.technologies' }
    },
    ], function(err,data) {
        if (data.length === 0) {
            response = { 'message': constants.CONFLICT };
        }
        else {
            onCreate(data);
            response = { 'message' : constants.OK };
        }

        res.json(response);
    });

    var onCreate = function (data) {
    //---------------Resume Creation Method-----------------//
    var onError = function (err) {
        logger.error(err.message);
        assert(false);
    };

    var docx = officegen ( 'docx' );
    docx.on ( 'error', onError );
    var pObj = docx.createP ();

    pObj.options.align = 'center';
    pObj.addText ( data[0].candidates.CandidateName, { font_face: 'Calibri', align: 'center',bold: true,font_size: 16} );
    pObj.addLineBreak ();

    var pObj = docx.createP ();
    pObj.addText ( constants.BRIEF_OVERVIEW, { font_face: 'Calibri',bold: true,font_size: 14} );
    pObj.addHorizontalLine ();

    var pObj = docx.createListOfDots ();
    pObj.addText (constants.OVER + data[0].candidates.Experience + constants.EXPERIENCE);

    var pObj = docx.createListOfDots ();
    pObj.addText (constants.CANDIDATE_TEAM_SIZE + data[0].candidates.TeamSize + constants.IN_MULTIPLE_PROJECTS);

    var pObj = docx.createListOfDots ();
    pObj.addText (constants.DOMAIN_EXPERTIES + data[0].candidates.domains.map(e => e.DomainName).join(', ') + '.');

    var pObj = docx.createListOfDots ();
    pObj.addText (constants.RICH_EXPERIENCE + data[0].candidates.applications.map(e => e.ApplicationName).join(', ') + constants.APPLICATIONS);

    var knowledgeDescription = data[0].candidates.KnowledgeDescription.split(';');
    for(var index = 0;index < knowledgeDescription.length; index++)
    {
        var pObj = docx.createListOfDots ();
        pObj.addText (knowledgeDescription[index]);
    }

    var pObj = docx.createP ();
    pObj.addText (constants.SKILL_SET, { font_face: 'Calibri',bold: true,font_size: 14} );
    pObj.addHorizontalLine ();

    //================Table=========================//
    var table = [
        [constants.OS, data[0].candidates.os.map(e => e.OperatingSystemName).join(', ')],
        [constants.WEB_TECHNOLOGIES,data[0].candidates.technologies.map(e => e.TechnologyName).join(', ')],
        [constants.LANG_TOOLS,data[0].candidates.languages.map(e => e.LanguageName).join(',')],
        [constants.FRAMEWORK,data[0].candidates.frameworks.map(e => e.FrameworkName).join(', ')],
        [constants.DATABASES_TABLE,data[0].candidates.databases.map(e=>e.DatabaseName).join(', ')]
    ]

    var tableStyle = {
        tableColWidth: 4500,
        //tableSize: 50,
        tableColor: '000000',
        tableAlign: 'left',
        tableFontFamily: 'Calibri',
        borders: true
    }

    //var pObj = docx.createP ();
    docx.createTable (table, tableStyle);
    var pObj = docx.createP ();
    var pObj = docx.createP ();
    pObj.addText (constants.WORK_EXPERIENCE, { font_face: 'Calibri',bold: true,font_size: 14} );
    pObj.addHorizontalLine ();
    pObj.options.align = 'left';
    var pObj = docx.createP ();
    pObj.addText (constants.RESPONSIBILITIES, { font_face: 'Calibri',bold: true,font_size: 13} );

    var responsibilities = data[0].candidates.WorkDescription.split(';');
    for(var index = 0;index < responsibilities.length; index++)
    {
        var pObj = docx.createListOfDots ();
        pObj.addText (responsibilities[index]);
    }

    var pObj = docx.createP ();
    // pObj.addHorizontalLine ();
    var pObj = docx.createP ();
    pObj.addText (constants.PROJECT_EXPERIENCE, { font_face: 'Calibri',bold: true,font_size: 14} );
    pObj.addHorizontalLine ();

    for(var index = 0; index < data.length; index++)
    {
        pObj.addText (data[index].projects.ProjectName, { font_face: 'Calibri',bold: true,font_size: 13} );
        // pObj.addLineBreak ();
        var pObj = docx.createP ();
        pObj.addText(constants.TECHNOLOGIES, {font_face: 'Calibri',bold: true})
        pObj.addText(data[index].projects.technologies.map(e=>e.TechnologyName).join(', '),{font_face: 'Calibri'})
        pObj.addLineBreak ();
        pObj.addText(constants.OPERATING_SYSTEMS,{font_face: 'Calibri',bold: true})
        pObj.addText(data[index].projects.operatingsystems.map(e=>e.OperatingSystemName).join(', '),{font_face: 'Calibri'})
        pObj.addLineBreak ();
        pObj.addText(constants.DOMAINS,{font_face: 'Calibri',bold: true})
        pObj.addText(data[index].projects.domains.map(e=>e.DomainName).join(', '),{font_face: 'Calibri'})
        pObj.addLineBreak ();
        pObj.addText(constants.DATABASES,{font_face: 'Calibri',bold: true})
        pObj.addText(data[index].projects.databases.map(e=>e.DatabaseName).join(', '),{font_face: 'Calibri'})
        var pObj = docx.createP ();
        pObj.addText(constants.PROJECT_DESCRIPTION,{font_face: 'Calibri',bold: true})
        pObj.addText(data[index].projects.Description,{font_face: 'Calibri'})

        var pObj = docx.createP ();
        pObj.addText(constants.ROLES_RESPONSIBILITIES_PROJECT,{font_face: 'Calibri',bold: true})

        var pObj = docx.createListOfDots ();
        pObj.addText (constants.WORK_AS_A + data[index].projectroles[0].ProjectRoleName);
        for(var indexRes = 0; indexRes < data[index].Responsibilities.split(';').length;indexRes++)
        {
          // pObj.addLineBreak ();
          var pObj = docx.createListOfDots ();
          pObj.addText (data[index].Responsibilities.split(';')[indexRes]);
        }

        var pObj = docx.createP ();
    }
    /////////////////////////////

    // var pObj = docx.createP ();

    var pObj = docx.createP ();
    pObj.addText (constants.EDU_CER_TRA, { font_face: 'Calibri',bold: true,font_size: 14} );
    pObj.addHorizontalLine ();
    // var pObj = docx.createP ();

    var educationDetails = data[0].candidates.EducationDescription.split(';');
    for(var index = 0;index < educationDetails.length; index++)
    {
      var pObj = docx.createListOfDots ();
      pObj.addText (educationDetails[index]);
      // pObj.addLineBreak ();
    }

    var pObj = docx.createP ();

    //-------------------------Header-Footer---------------------------//
    var header = docx.getHeader ().createP ();
    header.options.align = 'right';
    header.addText (data[0].candidates.CandidateName);

    var footer = docx.getFooter ().createP ();
    footer.options.align = 'center';
    footer.addText ( constants.ANSIBYTECODELLP,{font_size: 13});
    footer.addLineBreak ();
    footer.addText ( constants.ADDRESS1);
    footer.addLineBreak ();
    footer.addText ( constants.ADDRESS2 );
    //-------------------------Header-Footer---------------------------//

    var FILENAME = data[0].candidates.CandidateName + constants.DOCS_EXTENTION;
    var dirPath =  path.dirname(__dirname);
    console.log(path.dirname(__dirname));
    var file = __dirname + constants.UPLOADS + FILENAME;
    var out = fs.createWriteStream(file);
    docx.generate(out);
    out.on ( 'close', function () {
    });
    //========================Table End==================//
    };
}

exports.resumeCreation = resumeCreation;