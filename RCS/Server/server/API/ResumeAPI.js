var Candidate = require('./../Models/Candidate.js');
var ProjectDetail = require('./../Models/ProjectDetail.js');
mongoose = require('mongoose');
ObjectId = mongoose.Types.ObjectId;
var path = require('path');
var fs = require('fs');
var constants = require('./../Constants/Constants.js');
var commonFunctions = require('./../Common/CommonFunctions.js');
var redisCache = require('./../public/Cache.js');
/* log4js*/
var log4js = require('log4js');
log4js.configure('./log4js.json');
var logger = log4js.getLogger('rms-appender');

let resumeGetAll = (req, res) => {
    redisCache.wrap(constants.RESUMEGETALL_CACHEKEY, function (cacheCb) {
        Candidate.find({ IsDelete: false }, cacheCb).sort({ 'CandidateName': 1 });
    }, commonFunctions.responder(res));
};

let resumeGetById = (req, res) => {
    let id = req.params.id;
    var cacheKey = constants.RESUME_CACHEKEY + id;
    redisCache.wrap(cacheKey, function (cacheCb) {
        Candidate.findOne({ _id: id }, cacheCb);
    }, commonFunctions.responder(res));
};

let resumeGetAllDetailsById = (req, res) => {
    ProjectDetail.aggregate([
       {
            '$match': { 'CandidateId' : ObjectId(req.params.id) }
       },
       { $lookup: {
        from: 'candidates',
        localField: 'CandidateId',
        foreignField: '_id',
        as: 'candidates'}
      },
      { '$unwind': '$candidates' },
      { $lookup: {
        from: 'domains',
        localField: 'candidates.DomainId',
        foreignField: '_id',
        as: 'candidates.domains'}
      },
      { $lookup: {
        from: 'technologies',
        localField: 'candidates.TechnologyId',
        foreignField: '_id',
        as: 'candidates.technologies'}
      },
      { $lookup: {
        from: 'databases',
        localField: 'candidates.DatabaseId',
        foreignField: '_id',
        as: 'candidates.databases'}
      },
      { $lookup: {
        from: 'applications',
        localField: 'candidates.ApplicationId',
        foreignField: '_id',
        as: 'candidates.applications'}
      },
       { $lookup: {
        from: 'frameworks',
        localField: 'candidates.FrameworkId',
        foreignField: '_id',
        as: 'candidates.frameworks'}
      },
       { $lookup: {
        from: 'languages',
        localField: 'candidates.LanguageId',
        foreignField: '_id',
        as: 'candidates.languages'}
      },
      { $lookup: {
        from: 'operatingsystems',
        localField: 'candidates.OperatingSystemId',
        foreignField: '_id',
        as: 'candidates.os'}
      },
      { $lookup: {
        from: 'projectroles',
        localField: 'RoleId',
        foreignField: '_id',
        as: 'projectroles'}
      },
      { $lookup: {
        from: 'projects',
        localField: 'ProjectId',
        foreignField: '_id',
        as: 'projects'}
      },
      { '$unwind': '$projects' },
      { $lookup: {
        from: 'domains',
        localField: 'projects.DomainId',
        foreignField: '_id',
        as: 'projects.domains'}
      },
      { $lookup: {
        from: 'databases',
        localField: 'projects.DatabaseId',
        foreignField: '_id',
        as: 'projects.databases'}
      },
      { $lookup: {
        from: 'operatingsystems',
        localField: 'projects.OperatingSystemId',
        foreignField: '_id',
        as: 'projects.operatingsystems'}
      },
      { $lookup: {
        from: 'technologies',
        localField: 'projects.TechnologyId',
        foreignField: '_id',
        as: 'projects.technologies'}
      },
    ], function(err,data) {
      if(err) {
          logger.error(err.message);
      }
      else {
        if(data.length !=0)
        {
          res.json(data);
        }
        else {
          Candidate.aggregate([
        {
            '$match': { '_id' : ObjectId(req.params.id)}
       },
                { $lookup: {
        from: 'domains',
        localField: 'DomainId',
        foreignField: '_id',
        as: 'domains'}
      },
                { $lookup: {
        from: 'technologies',
        localField: 'TechnologyId',
        foreignField: '_id',
        as: 'technologies'}
      },
                { $lookup: {
        from: 'databases',
        localField: 'DatabaseId',
        foreignField: '_id',
        as: 'databases'}
      },
                { $lookup: {
        from: 'applications',
        localField: 'ApplicationId',
        foreignField: '_id',
        as: 'applications'}
      },
                { $lookup: {
        from: 'frameworks',
        localField: 'FrameworkId',
        foreignField: '_id',
        as: 'frameworks'}
      },
                { $lookup: {
        from: 'languages',
        localField: 'LanguageId',
        foreignField: '_id',
        as: 'languages'}
      },
                { $lookup: {
        from: 'operatingsystems',
        localField: 'OperatingSystemId',
        foreignField: '_id',
        as: 'os'}
      },
                ], function(err,candidateData)
  {
    if(err) {
        logger.error(err.message);
    }
    else {
      res.json(candidateData);
    }
    });
        }
      }
    });
};

let downloadResume = (req, res, next) => {
      var fileName = req.params.name + '.docx';
      var dirPath =  path.dirname(__dirname);
      var file = dirPath + '/Uploads/' + fileName;
      fs.access(file, (err) => {
        if (!err) {
              res.sendFile(file, {headers: {'Content-Type': 'application/msword'}});
          return;
        }
        else {
          res.json(null);
        }
      });
};

let resumeInsert = (req, res) => {
    var resumeSchema = new Candidate({
        CandidateName: req.body.CandidateName,
        EducationDescription: req.body.EducationDescription,
        CurrentCompanyName : req.body.CurrentCompanyName,
        Experience : req.body.Experience,
        TeamSize : req.body.TeamSize,
        ProjectCount : req.body.ProjectCount,
        KnowledgeDescription : req.body.KnowledgeDescription,
        WorkDescription: req.body.WorkDescription,
        DomainId : req.body.Domain,
        ApplicationId : req.body.Application,
        OperatingSystemId : req.body.OperatingSystem,
        TechnologyId : req.body.Technology,
        FrameworkId : req.body.Framework,
        LanguageId : req.body.Language,
        DatabaseId : req.body.Database,
        DesignationId : req.body.DesignationId,
        IsActive : req.body.IsActive,
        IsDelete : req.body.IsDelete
    });

    // Candidate.find({ CandidateName: req.body.CandidateName, _id: { $ne: req.body._id }, IsDelete: false }, function(err, data) {
    //     if (data.length) {
    //         response = { data: data, 'message' : 'Conflict' };
    //         res.send(response);
    //     }
    //     else {
            resumeSchema.save(function(err,data) {
                if(err) {
                    logger.error(err.message);
                }
                else {
                    //Insert Project Details
                    for(var index = 0 ; index < req.body.Projects.length; index++)
                    {
                          var projectDetailSchema = new ProjectDetail({
                              CandidateId: data._id,
                              ProjectId: ObjectId(req.body.Projects[index].ProjectId),
                              RoleId : ObjectId(req.body.Projects[index].RoleId),
                              Responsibilities : req.body.Projects[index].Responsibilities,
                          });

                          projectDetailSchema.save(function(err,data) {
                            if(err) {
                                logger.error(err.message);
                            }
                            else {
                            }
                          });
                    }

                    Candidate.find({ IsDelete: false }, function(err, data) {
                        if(err) {
                            res.send(err);
                            logger.error(err.message);
                        }

                        redisCache.set(constants.RESUMEGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                              if (err) {
                                  logger.error(err + '-' + constants.RESUME_INSERT);
                                  throw err;
                              }
                        });

                        response = { data: data, 'message' : constants.OK };
                        res.json(response);
                    }).sort({ 'CandidateName': 1 });
                }
            });
        // }
    // });
};

let resumeUpdate = (req, res) => {
    // Candidate.find({ CandidateName: req.body.CandidateName, _id:{ $ne: req.body._id }, IsDelete: false }, function(err, data) {
        // if (data.length) {
        //     response = { data: data, 'message' : 'Conflict' };
        //     res.send(response);
        // }
        // else {
            Candidate.update({ _id: req.body.CandidateId }, { $set:
              {
                CandidateName: req.body.CandidateName,
                EducationDescription: req.body.EducationDescription,
                CurrentCompanyName : req.body.CurrentCompanyName,
                Experience : req.body.Experience,
                TeamSize : req.body.TeamSize,
                ProjectCount : req.body.ProjectCount,
                KnowledgeDescription : req.body.KnowledgeDescription,
                WorkDescription: req.body.WorkDescription,
                DomainId : req.body.Domain,
                ApplicationId : req.body.Application,
                OperatingSystemId : req.body.OperatingSystem,
                TechnologyId : req.body.Technology,
                FrameworkId : req.body.Framework,
                LanguageId : req.body.Language,
                DatabaseId : req.body.Database,
                DesignationId : req.body.DesignationId,
                IsActive : req.body.IsActive,
                IsDelete : req.body.IsDelete
             }
           },
                function(err) {
                    if(err) {
                        logger.error(err.message);
                    }
                    else {
                        //update Project Details
                        ////Delete old project detail records.
                        ProjectDetail.remove(
                          { CandidateId : req.body.CandidateId }, function(err, d) {
                            if(err) {
                                logger.error(err.message);
                            }
                          }
                        )
                      // });

                        ////Insert new project detail records.
                        for(var index = 0 ; index < req.body.Projects.length; index++)
                        {
                              var projectDetailSchema = new ProjectDetail({
                                  CandidateId:req.body.CandidateId,
                                  ProjectId: ObjectId(req.body.Projects[index].ProjectId),
                                  RoleId : ObjectId(req.body.Projects[index].RoleId),
                                  Responsibilities : req.body.Projects[index].Responsibilities,
                              });

                              projectDetailSchema.save(function(err,data) {
                                if(err) {
                                    logger.error(err.message);
                                }
                                else {
                                }
                              });
                        }

                        Candidate.find({ IsDelete: false }, function(err, data) {
                            if(err) {
                                res.send(err);
                                logger.error(err.message);
                            }

                            var cacheKey = constants.RESUME_CACHEKEY + req.body.CandidateId;
                            redisCache.set(cacheKey, data.filter(x=>x._id == req.body.CandidateId)[0], {ttl: 1}, function(err) {
                                if (err) {
                                    logger.error(err + '-' + constants.RESUME_UPDATE);
                                    throw err;
                                }

                                redisCache.set(constants.RESUMEGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                                    if (err) {
                                        logger.error(err + '-' + constants.RESUME_UPDATE);
                                        throw err;
                                    }
                                });
                            });

                            response = { data: data, 'message' : constants.OK };
                            res.json(response);
                        }).sort({ 'CandidateName': 1 });
                    }
                }
            );
        // }
    // });
};

let resumeDelete = (req, res) => {
  //  var conflictStatus = 0;
    // Candidate.find({ _id: req.params.id }, function(err, result) {
    //     if (result.length) {
    //         conflictStatus = 1;
    //     }
        // if (conflictStatus === 1) {
        //     response = { data: [], 'message' : 'Conflict' };
        //     res.json(response);
        // }
        // else {
            Candidate.update({ _id: req.params.id }, { $set: { IsDelete: true } },
                function(err) {
                    if(err) {
                        logger.error(err.message);
                    }
                    else {
                        Candidate.find({ IsDelete: false }, function(err, data) {
                            if(err) {
                                res.send(err);
                                logger.error(err.message);
                            }

                            redisCache.set(constants.RESUMEGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                                  if (err) {
                                      logger.error(err +  '-' + constants.RESUME_DELETE);
                                      throw err;
                                  }
                            });

                            response = { data: data, 'message' : constants.OK };
                            res.json(response);
                        }).sort({ 'CandidateName': 1 });
                    }
                }
            );
        // }
    // });
};

exports.resumeGetAll = resumeGetAll;
exports.resumeGetById = resumeGetById;
exports.resumeGetAllDetailsById = resumeGetAllDetailsById;
exports.resumeInsert = resumeInsert;
exports.resumeUpdate = resumeUpdate;
exports.resumeDelete = resumeDelete;
exports.downloadResume = downloadResume;