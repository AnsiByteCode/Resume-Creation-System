var assert = require('assert');
var officegen = require('officegen');
var fs = require('fs');
var path = require('path');
var ProjectDetails = require('./../Models/ProjectDetails.js');
var Role = require('./../Models/Role.js');
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

let projectCollection = [];

let resumeCreation = (req, res) => {

var candidateId = ObjectId(req.body.CandidateId);
let databaseNames = [];
let applicationNames = [];
let frameworkNames = [];
let osNames = [];
let languageNames=[];
let domainNames=[];
let technologyNames=[];
// let candidateRecord;

Candidate.findOne({ _id: candidateId }, function(err, data) {
    if(err) {
        console.log(err.message);
    }
    let candidateRecord = data;
    var databaseArray = data.DatabaseId.split(',');
    var applicationArray = data.ApplicationId.split(',');
    var frameworkArray = data.FrameworkId.split(',');
    var osArray = data.OperatingSystemId.split(',');
    var languageArray = data.LanguageId.split(',');
    var domainArray = data.DomainId.split(',');
    var technologyArray = data.TechnologyId.split(',');
    var databases = [];
    var applications = [];
    var frameworks = [];
    var os = [];
    var languages = [];
    var domains = [];
    var technologies = [];

    for(var index = 0; index < databaseArray.length; index++)
    {
      databases.push(ObjectId(databaseArray[index]));
    }

    for(var index = 0; index < applicationArray.length; index++)
    {
        applications.push(ObjectId(applicationArray[index]));
    }

    for(var index = 0; index < frameworkArray.length; index++)
    {
        frameworks.push(ObjectId(frameworkArray[index]));
    }

    for(var index = 0; index < osArray.length; index++)
    {
        os.push(ObjectId(osArray[index]));
    }

    for(var index = 0; index < languageArray.length; index++)
    {
        languages.push(ObjectId(languageArray[index]));
    }

    for(var index = 0; index < domainArray.length; index++)
    {
        domains.push(ObjectId(domainArray[index]));
    }

    for(var index = 0; index < technologyArray.length; index++)
    {
        technologies.push(ObjectId(technologyArray[index]));
    }

  Database.find( { _id: { $in: databases} } , function(err, data) {

        if(err) {}
        for(var index = 0; index < data.length; index++)
        {
          databaseNames.push(data[index].DatabaseName);
        }
        databaseNames = databaseNames.join(', ');

        Application.find( { _id: { $in: applications} } , function(err, data) {
              if(err) {}
              for(var index = 0; index < data.length; index++)
              {
                applicationNames.push(data[index].ApplicationName);
              }
              applicationNames = applicationNames.join(',');


              Framework.find( { _id: { $in: frameworks} } , function(err, data) {
                    if(err) {}
                    for(var index = 0; index < data.length; index++)
                    {
                      frameworkNames.push(data[index].FrameworkName);
                    }
                    frameworkNames = frameworkNames.join(',');
                    OperatingSystem.find( { _id: { $in: os} } , function(err, data) {
                          if(err) {}
                          for(var index = 0; index < data.length; index++)
                          {
                            osNames.push(data[index].OperatingSystemName);
                          }
                          osNames = osNames.join(',');
                          Language.find( { _id: { $in: languages} } , function(err, data) {
                                if(err) {}
                                for(var index = 0; index < data.length; index++)
                                {
                                  languageNames.push(data[index].LanguageName);
                                }
                                languageNames = languageNames.join(',');

                                Domain.find( { _id: { $in: domains} } , function(err, data) {
                                      if(err) {}
                                      for(var index = 0; index < data.length; index++)
                                      {
                                          domainNames.push(data[index].DomainName);
                                      }
                                      domainNames = domainNames.join(',');
                                      console.log(domainNames);
                                      Technology.find( { _id: { $in: technologies} } , function(err, data) {
                                            if(err) {}
                                            for(var index = 0; index < data.length; index++)
                                            {
                                                technologyNames.push(data[index].TechnologyName);
                                            }
                                            technologyNames = technologyNames.join(',');

                                            ProjectDetails.aggregate([
                                              {
                                                  $unwind: '$ProjectId'
                                               },
                                               {
                                                  $lookup:
                                                     {
                                                        from: 'projects',
                                                        localField: 'ProjectId',
                                                        foreignField: '_id',
                                                        as: 'project'
                                                    }
                                               },
                                               {
                                                  $lookup:
                                                     {
                                                        from: 'roles',
                                                        localField: 'RoleId',
                                                        foreignField: '_id',
                                                        as: 'Role'
                                                    }
                                               },
                                               {
                                                    '$match': { 'CandidateId' : candidateRecord._id}
                                               }
                                            ],function(err,data){

                                              var projectcollection = [];
                                              for(var index = 0; index < data.length;index++)
                                              {
                                                  getProjectDetails(data[index],function(err,project){

                                                  projectcollection.push(project);
                                              });
                                              console.log(projectcollection);
                                              }
                                            });


                                              // let projectDetails = getProjectDetails(candidateRecord._id,function(){

                                              //     onCreate(candidateRecord.CandidateName,candidateRecord.Experience,candidateRecord.TeamSize,candidateRecord.WorkDescription,candidateRecord.EducationDescription,candidateRecord.KnowledgeDescription,technologyNames,databaseNames,languageNames,osNames,frameworkNames,applicationNames);
                                              // });
                                            // onCreate(candidateRecord.CandidateName,candidateRecord.Experience,candidateRecord.TeamSize,candidateRecord.WorkDescription,candidateRecord.EducationDescription,candidateRecord.KnowledgeDescription,technologyNames,databaseNames,languageNames,osNames,frameworkNames,applicationNames);
                                      });
                                });
                          });
                    });
              });
        });
    });
});

var getProjectDetails = function(data){

  // ProjectDetails.aggregate([
  //    {
  //       $unwind: '$ProjectId'
  //    },
  //    {
  //       $lookup:
  //          {
  //             from: 'projects',
  //             localField: 'ProjectId',
  //             foreignField: '_id',
  //             as: 'project'
  //         }
  //    },
  //    {
  //         '$match': { 'CandidateId' : candidateId}
  //    }
  // ],

  // function(err,data){
    // for(var index = 0;index < data.length; index++)
    // {
      let project = [];
      project['Responsibilities'] = data.Responsibilities;
      project['ProjectName'] = data.project[0].ProjectName;
      // Role.find({'_id' : data.RoleId},function(err,roledata){
      project['RoleName'] = data.Role[0].RoleName;
      var databasePArray = data.project[0].DatabaseId.split(',');
      var technologyPArray = data.project[0].TechnologyId.split(',');
      var domainPArray = data.project[0].DomainId.split(',');
      var osPArray = data.project[0].OperatingSystemId.split(',');
      let databases = [];
      let databaseNames;
      let technologies = [];
      let technologyNames;
      let domains = [];
      let domainNames;
      let operatingSystems = [];
      let osNames;
      for(var index = 0; index < databasePArray.length; index++)
      {
        databases.push(ObjectId(databasePArray[index]));
      }

      for(var index = 0; index < technologyPArray.length; index++)
      {
        technologies.push(ObjectId(technologyPArray[index]));
      }

      for(var index = 0; index < domainPArray.length; index++)
      {
        domains.push(ObjectId(domainPArray[index]));
      }

      for(var index = 0; index < osPArray.length; index++)
      {
        operatingSystems.push(ObjectId(osPArray[index]));
      }

      Database.find( { _id: { $in: databases} } , function(err, data) {
            if(err) {}
            for(var index = 0; index < data.length; index++)
            {
              databaseNames.push(data[index].DatabaseName);
            }
            project['Databases'] = databaseNames.join(', ');

            OperatingSystem.find( { _id: { $in: operatingSystems} } , function(err, data) {

                  for(var index = 0; index < data.length; index++)
                  {
                    osNames.push(data[index].OperatingSystemName);
                  }
                  project['OS'] = osNames.join(', ');
                    Technology.find( { _id: { $in: technologies} } , function(err, data) {
                          for(var index = 0; index < data.length; index++)
                          {
                            technologyNames.push(data[index].TechnologyName);
                          }
                          project['Technologies'] = technologyNames.join(', ');

                            Domain.find( { _id: { $in: domains} } , function(err, data) {
                              for(var index = 0; index < data.length; index++)
                              {
                                domainNames.push(data[index].DomainName);
                              }
                              project['Domains'] = domainNames.join(', ');
                                return project;
                            });
                    });
             });
          });

};

var onCreate = function (candidateName,experience,teamsize,workDescription,educationDescription,knowledgeDescription,technologies,databases,languages,os,frameworks,applications) {


//---------------Resume Creation Method-----------------//
var onError = function (err) {
  console.log(err);
  assert(false);
};

  var docx = officegen ( 'docx' );
  docx.on ( 'error', onError );
  var pObj = docx.createP ();

pObj.options.align = 'center';
pObj.addText ( candidateName, { font_face: 'Calibri', align: 'center',bold: true,font_size: 16} );
pObj.addLineBreak ();


var pObj = docx.createP ();
pObj.addText ( 'Brief Overview', { font_face: 'Calibri',bold: true,font_size: 14} );
pObj.addHorizontalLine ();
// var pObj = docx.createListOfDots ();

var pObj = docx.createListOfNumbers ();

pObj.addText ('Over '+ experience +'+'+' years of experience in Software Development');
pObj.addLineBreak ();

var pObj = docx.createListOfNumbers ();
pObj.addText ('Worked with Team Size of '+ teamsize +'+ and multiple projects');
pObj.addLineBreak ();

var pObj = docx.createP ();
pObj.addText ('Skill set', { font_face: 'Calibri',bold: true,font_size: 14} );
pObj.addHorizontalLine ();


//================Table=========================//
  var table = [
  ['OS', os],
  ['Web Technologies',technologies],
  ['Languages and Tools',languages],
  ['Frameworks',frameworks],
  ['Databases',databases]
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
pObj.addText ('Work Experience', { font_face: 'Calibri',bold: true,font_size: 14} );
pObj.addHorizontalLine ();
pObj.options.align = 'left';
var pObj = docx.createP ();
pObj.addText ('Responsibilities:', { font_face: 'Calibri',bold: true,font_size: 13} );

var responsibilities = workDescription.split('.');
for(var index = 0;index < responsibilities.length; index++)
{
  var pObj = docx.createListOfDots ();
  pObj.addText (responsibilities[index]);
}

// var pObj = docx.createListOfDots ();
// pObj.options.align = 'jestify';
// pObj.addText ('Worked on projects for the medium size multi-level retail companies, Health Care Domain.');
// var pObj = docx.createListOfDots ();
// // pObj.options.align = 'jestify';
// pObj.addText ('Worked with team sizes ranging from 8+ engineers.');
// var pObj = docx.createListOfDots ();
// //pObj.options.align = 'jestify';
// pObj.addText ('Code Optimization');
// var pObj = docx.createListOfDots ();
// // pObj.options.align = 'jestify';
// pObj.addText ('Design Pattern Implementation');


var pObj = docx.createP ();
pObj.addHorizontalLine ();
var pObj = docx.createP ();
pObj.addText ('Project Experience', { font_face: 'Calibri',bold: true,font_size: 14} );
pObj.addHorizontalLine ();
var pObj = docx.createListOfNumbers ();
pObj.addText ('BankNizwa – Corporate Banking Website with Umbraco CMS', { font_face: 'Calibri',bold: true,font_size: 12} );
pObj.addLineBreak ();
var pObj = docx.createP ();
pObj.addText('Technologies: ',{font_face: 'Calibri',bold: true})
pObj.addText('Umbraco 7.5.7, ASP.Net 4.5, MVC 5.x:',{font_face: 'Calibri'})
pObj.addLineBreak ();
pObj.addText('Operating Systems: ',{font_face: 'Calibri',bold: true})
pObj.addText('Windows Server 2012 R2',{font_face: 'Calibri'})
pObj.addLineBreak ();
pObj.addText('Domain: ',{font_face: 'Calibri',bold: true})
pObj.addText('Banking',{font_face: 'Calibri'})
pObj.addLineBreak ();
pObj.addText('Database: ',{font_face: 'Calibri',bold: true})
pObj.addText('MS SQL Server 2014',{font_face: 'Calibri'})

var pObj = docx.createP ();
pObj.addText('Project Description: ',{font_face: 'Calibri',bold: true})
pObj.addText('This is a project under Banking domain, and based on the concept of CMS. The system is managed by Umbraco CMS. It is a Corporate web site for Nizwa Bank, Muscat & Oman. The content of the site can be managed through its admin panel. A user having the admin rights, can add the contents to the website as per his need. Admin panel has different types of editors where the user can easily make changes as per the requirement.',{font_face: 'Calibri'})

var pObj = docx.createP ();
pObj.addText('Role and Responsibility in project : ',{font_face: 'Calibri',bold: true})

pObj.addLineBreak ();
// var pObj = docx.createListOfDots ();
pObj.addText ('   •  Work as a Dedicated developer for client.');
// var pObj = docx.createListOfDots ();
pObj.addLineBreak ();
pObj.addText ('   •  Understanding the requirements and designing Technical Specifications documents');
// var pObj = docx.createListOfDots ();
pObj.addLineBreak ();
pObj.addText ('   •  Designing and developing database through database project in .Net');
// var pObj = docx.createListOfDots ();
pObj.addLineBreak ();
pObj.addText ('   •  Configuring and managing Deployment on production as well as on UAT environment');
// var pObj = docx.createListOfDots ();
pObj.addLineBreak ();
pObj.addText ('   •  Provided technical / functional help to client.');
var pObj = docx.createP ();

var pObj = docx.createP ();
pObj.addText ('Education/Certifications/Trainings', { font_face: 'Calibri',bold: true,font_size: 14} );
pObj.addHorizontalLine ();
var pObj = docx.createP ();

var educationDetails = educationDescription.split('.');
for(var index = 0;index < educationDetails.length; index++)
{
  pObj.addText ('  •   ' + educationDetails[index]);
  pObj.addLineBreak ();
}


// pObj.addText ('  •   Saffrony Institute of Technology (G.T.U) B E in Computer (2010-2013)');
// pObj.addLineBreak ();
// pObj.addText ('  •   R.C Technical (G.T.U) Diploma in Computer 2008-2010');
// pObj.addLineBreak ();
// pObj.addText ('  •   C U Shah Higher Secondary School');
// pObj.addLineBreak ();
// pObj.addText ('  •   S.S.C. Mount Carmel High School');



var pObj = docx.createP ();

//-------------------------Header-Footer---------------------------//
var header = docx.getHeader ().createP ();
header.options.align = 'right';
// header.addText ( 'Nidhi N Patel' );
header.addText (candidateName);
//header.addHorizontalLine ();

var footer = docx.getFooter ().createP ();
footer.options.align = 'center';
footer.addText ( 'Ansi ByteCode LLP.',{font_size: 13});
footer.addLineBreak ();
footer.addText ( 'D-203, 2nd Floor, Ganesh Meridian, Besides Audi Showroom,' );
footer.addLineBreak ();
footer.addText ( 'Opp. Gujarat High Court, S.G.Highway, Ahmedabad -54' );
//Ansi ByteCode LLP.
//D-203, 2nd Floor, Ganesh Meridian, Besides Audi Showroom,
//Opp. Gujarat High Court, S.G.Highway, Ahmedabad -54
//-------------------------Header-Footer---------------------------//


  // // var FILENAME = 'Test.docx';
  // var FILENAME = candidateName + '.docx';
  // var dirPath =  path.dirname(__dirname);
  // console.log(path.dirname(__dirname));
  // //var file = dirPath + 'uploads'+'' + FILENAME;
  // var file = __dirname + '/../uploads/' + FILENAME;
  // // var file = dirPath + '\\uploads\\' + FILENAME;
  // var out = fs.createWriteStream(file);
  //
  // // var out = fs.createWriteStream(OUTDIR + FILENAME);
  // docx.generate(out);
  // out.on ( 'close', function () {
  // });
//========================Table End==================//

};

//-----------------Resume Creation Method End-------------------------//
};

exports.resumeCreation = resumeCreation;