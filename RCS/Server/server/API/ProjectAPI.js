var Project = require('./../Models/Project.js');
var ProjectDetails = require('./../Models/ProjectDetails.js');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var constants = require('./../Constants/Constants.js');
var commonFunctions = require('./../Common/CommonFunctions.js');
var redisCache = require('./../public/Cache.js');
/* log4js*/
var log4js = require('log4js');
log4js.configure('./log4js.json');
var logger = log4js.getLogger('rms-appender');

let projectGetAll = (req, res) => {
    redisCache.wrap(constants.PROJECTGETALL_CACHEKEY, function (cacheCb) {
        Project.aggregate([
            {
                $lookup: {
                    from: 'domains',
                    localField: 'DomainId',
                    foreignField: '_id',
                    as: 'domains'
                }
            },
            {
                $lookup:
                {
                    from: 'operatingsystems',
                    localField: 'OperatingSystemId',
                    foreignField: '_id',
                    as: 'operatingsystems'
                }
            },
            {
                $lookup:
                {
                    from: 'technologies',
                    localField: 'TechnologyId',
                    foreignField: '_id',
                    as: 'technologies'
                }
            },
            {
                $lookup:
                {
                    from: 'databases',
                    localField: 'DatabaseId',
                    foreignField: '_id',
                    as: 'databases'
                }
            },
            {
                $unwind:'$domains'
            },
            {
                $unwind:'$databases'
            },
            {
                $unwind:'$operatingsystems'
            },
            {
                $project:
                {
                  'ProjectName': '$ProjectName',
                  'TeamSize': '$TeamSize',
                  'Description': '$Description',
                  'OtherTools': '$OtherTools',
                  'IsActive': '$IsActive',
                  'IsDelete': '$IsDelete',                  
                  'DatabaseId': '$DatabaseId',
                  'DomainId': '$DomainId',
                  'OperatingSystemId': '$OperatingSystemId',
                  'TechnologyId': '$TechnologyId',
                  'DomainName': '$domains.DomainName',
                  'OperatingSystemName': '$operatingsystems.OperatingSystemName',
                  'DatabaseName': '$databases.DatabaseName',
                  'TechnologyName': '$technologies.TechnologyName',
                  'databases': '$databases',
                  'domains': '$domains',
                  'operatingsystems': '$operatingsystems',
                  'technologies': '$technologies'
                }
            },
            {
                $match:
                    { 'IsDelete': false }
            },
            {
                $sort:
                    { 'ProjectName': 1 }
            }
        ], cacheCb);
    }, commonFunctions.responder(res));
};

let projectGetById = (req, res) => {
    let id = req.params.id;
    var cacheKey = constants.PROJECT_CACHEKEY + id;
    redisCache.wrap(cacheKey, function (cacheCb) {
        Project.aggregate([
            {
                '$match': { '_id': ObjectId(id) }
            },
            {
                $lookup:
                {
                    from: 'domains',
                    localField: 'DomainId',
                    foreignField: '_id',
                    as: 'domains'
                }
            },
            {
                $lookup:
                {
                    from: 'operatingsystems',
                    localField: 'OperatingSystemId',
                    foreignField: '_id',
                    as: 'operatingsystems'
                }
            },
            {
                $lookup:
                {
                    from: 'technologies',
                    localField: 'TechnologyId',
                    foreignField: '_id',
                    as: 'technologies'
                }
            },
            {
                $lookup:
                {
                    from: 'databases',
                    localField: 'DatabaseId',
                    foreignField: '_id',
                    as: 'databases'
                }
            },
            {
                $unwind:'$domains'
            },
            {
                $unwind:'$databases'
            },
            {
                $unwind:'$operatingsystems'
            },
            {
                $project:
                {
                    'ProjectName': '$ProjectName',
                    'TeamSize': '$TeamSize',
                    'Description': '$Description',
                    'OtherTools': '$OtherTools',
                    'IsActive': '$IsActive',
                    'IsDelete': '$IsDelete',                    
                    'DatabaseId': '$DatabaseId',
                    'DomainId': '$DomainId',
                    'OperatingSystemId': '$OperatingSystemId',
                    'TechnologyId': '$TechnologyId',
                    'DomainName': '$domains.DomainName',
                    'OperatingSystemName': '$operatingsystems.OperatingSystemName',
                    'DatabaseName': '$databases.DatabaseName',
                    'TechnologyName': '$technologies.TechnologyName',
                    'databases': '$databases',
                    'domains': '$domains',
                    'operatingsystems': '$operatingsystems',
                    'technologies': '$technologies'
                }
            }
        ], cacheCb);
    }, commonFunctions.responder(res));
};

let projectActiveGetAll = (req, res) => {
    redisCache.wrap(constants.PROJECTACTIVEGETALL_CACHEKEY, function (cacheCb) {
        Project.find({ IsActive: true, IsDelete: false }, cacheCb).sort({ 'ProjectName': 1 });
    }, commonFunctions.responder(res));
};

let projectInsert = (req, res) => {
    var projectSchema = new Project({
        ProjectName: req.body.ProjectName,
        TeamSize: req.body.TeamSize,
        Description: req.body.Description,
        OtherTools: req.body.OtherTools,
        DomainId: req.body.DomainId,
        OperatingSystemId: req.body.OperatingSystemId,
        TechnologyId: req.body.Technology,
        DatabaseId: req.body.DatabaseId,
        IsActive: req.body.IsActive
    });

    Project.find({ ProjectName: req.body.ProjectName, _id: { $ne: req.body._id }, IsDelete: false }, function(err, data) {
        if (data.length) {
            response = { data: data, 'message' : constants.CONFLICT };
            res.send(response);
        }
        else {
            projectSchema.save(function(err) {
                if(err) {
                    logger.error(err.message);
                }
                else {
                  Project.aggregate([
                      {
                          $lookup: {
                              from: 'domains',
                              localField: 'DomainId',
                              foreignField: '_id',
                              as: 'domains'
                          }
                      },
                      {
                          $lookup:
                          {
                              from: 'operatingsystems',
                              localField: 'OperatingSystemId',
                              foreignField: '_id',
                              as: 'operatingsystems'
                          }
                      },
                      {
                          $lookup:
                          {
                              from: 'technologies',
                              localField: 'TechnologyId',
                              foreignField: '_id',
                              as: 'technologies'
                          }
                      },
                      {
                          $lookup:
                          {
                              from: 'databases',
                              localField: 'DatabaseId',
                              foreignField: '_id',
                              as: 'databases'
                          }
                      },
                      {
                          $unwind:'$domains'
                      },
                      {
                          $unwind:'$databases'
                      },
                      {
                          $unwind:'$operatingsystems'
                      },
                      {
                          $project:
                          {
                            'ProjectName': '$ProjectName',
                            'TeamSize': '$TeamSize',
                            'Description': '$Description',
                            'OtherTools': '$OtherTools',
                            'IsActive': '$IsActive',
                            'IsDelete': '$IsDelete',                            
                            'DatabaseId': '$DatabaseId',
                            'DomainId': '$DomainId',
                            'OperatingSystemId': '$OperatingSystemId',
                            'TechnologyId': '$TechnologyId',
                            'DomainName': '$domains.DomainName',
                            'OperatingSystemName': '$operatingsystems.OperatingSystemName',
                            'DatabaseName': '$databases.DatabaseName',
                            'TechnologyName': '$technologies.TechnologyName',
                            'databases': '$databases',
                            'domains': '$domains',
                            'operatingsystems': '$operatingsystems',
                            'technologies': '$technologies'
                          }
                      },
                      {
                          $match:
                              { 'IsDelete': false }
                      },
                      {
                          $sort:
                              { 'ProjectName': 1 }
                      }
                  ], function(err, data) {
                        if(err) {
                            res.send(err);
                            logger.error(err.message);
                        }

                        redisCache.set(constants.PROJECTGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                              if (err) {
                                  logger.error(err + '-' + constants.PROJECT_INSERT);
                                  throw err;
                              }

                              redisCache.set(constants.PROJECTACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                  if (err) {
                                      logger.error(err +  '-' + constants.PROJECT_INSERT);
                                      throw err;
                                  }
                              });
                        });

                        response = { data: data, 'message' : constants.OK };
                        res.json(response);
                    });
                }
            });
        }
    });
};

let projectUpdate = (req, res) => {
    Project.find({ ProjectName: req.body.ProjectName, _id: { $ne: req.body._id }, IsDelete: false }, function(err, data) {
        if (data.length) {
            response = { data: data, 'message' : constants.CONFLICT };
            res.send(response);
        }
        else {
            Project.update({ _id: req.body._id }, { $set: { ProjectName: req.body.ProjectName, TeamSize: req.body.TeamSize, Description: req.body.Description, OtherTools: req.body.OtherTools,
                              DomainId: req.body.DomainId, OperatingSystemId: req.body.OperatingSystemId, TechnologyId: req.body.Technology, DatabaseId: req.body.DatabaseId,
                              IsActive: req.body.IsActive, IsDelete: req.body.IsDelete } },
                function(err) {
                    if(err) {
                        logger.error(err.message);
                    }
                    else {
                      Project.aggregate([
                          {
                              $lookup: {
                                  from: 'domains',
                                  localField: 'DomainId',
                                  foreignField: '_id',
                                  as: 'domains'
                              }
                          },
                          {
                              $lookup:
                              {
                                  from: 'operatingsystems',
                                  localField: 'OperatingSystemId',
                                  foreignField: '_id',
                                  as: 'operatingsystems'
                              }
                          },
                          {
                              $lookup:
                              {
                                  from: 'technologies',
                                  localField: 'TechnologyId',
                                  foreignField: '_id',
                                  as: 'technologies'
                              }
                          },
                          {
                              $lookup:
                              {
                                  from: 'databases',
                                  localField: 'DatabaseId',
                                  foreignField: '_id',
                                  as: 'databases'
                              }
                          },
                          {
                              $unwind:'$domains'
                          },
                          {
                              $unwind:'$databases'
                          },
                          {
                              $unwind:'$operatingsystems'
                          },
                          {
                              $project:
                              {
                                'ProjectName': '$ProjectName',
                                'TeamSize': '$TeamSize',
                                'Description': '$Description',
                                'OtherTools': '$OtherTools',
                                'IsActive': '$IsActive',
                                'IsDelete': '$IsDelete',                                
                                'DatabaseId': '$DatabaseId',
                                'DomainId': '$DomainId',
                                'OperatingSystemId': '$OperatingSystemId',
                                'TechnologyId': '$TechnologyId',
                                'DomainName': '$domains.DomainName',
                                'OperatingSystemName': '$operatingsystems.OperatingSystemName',
                                'DatabaseName': '$databases.DatabaseName',
                                'TechnologyName': '$technologies.TechnologyName',
                                'databases': '$databases',
                                'domains': '$domains',
                                'operatingsystems': '$operatingsystems',
                                'technologies': '$technologies'
                              }
                          },
                          {
                              $match:
                                  { 'IsDelete': false }
                          },
                          {
                              $sort:
                                  { 'ProjectName': 1 }
                          }
                      ], function(err, data) {
                            if(err) {
                                res.send(err);
                                logger.error(err.message);
                            }

                            var cacheKey = constants.PROJECT_CACHEKEY + req.body._id;
                            redisCache.set(cacheKey, data.filter(x=>x._id == req.body._id), {ttl: 1}, function(err) {
                                if (err) {
                                    logger.error(err + '-' + constants.PROJECT_UPDATE);
                                    throw err;
                                }

                                redisCache.set(constants.PROJECTGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                                    if (err) {
                                        logger.error(err + '-' + constants.PROJECT_UPDATE);
                                        throw err;
                                    }

                                    redisCache.set(constants.PROJECTACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                        if (err) {
                                            logger.error(err + '-' + constants.PROJECT_UPDATE);
                                            throw err;
                                        }
                                    });
                                });
                            });

                            response = { data: data, 'message' : constants.OK };
                            res.json(response);
                        });
                    }
                }
            );
        }
    });
};

let projectDelete = (req, res) => {
    var conflictStatus = 0;
    ProjectDetails.find({ ProjectId: req.params.id }, function(err, data) {
        if (data.length) {
            conflictStatus = 1;
        }
        if (conflictStatus === 1) {
            response = { data: [], 'message' : constants.CONFLICT };
            res.json(response);
        }
        else {
            Project.update({ _id: req.params.id }, { $set: { IsDelete: true } },
                function(err) {
                    if(err) {
                        logger.error(err.message);
                    }
                    else {
                      Project.aggregate([
                          {
                              $lookup: {
                                  from: 'domains',
                                  localField: 'DomainId',
                                  foreignField: '_id',
                                  as: 'domains'
                              }
                          },
                          {
                              $lookup:
                              {
                                  from: 'operatingsystems',
                                  localField: 'OperatingSystemId',
                                  foreignField: '_id',
                                  as: 'operatingsystems'
                              }
                          },
                          {
                              $lookup:
                              {
                                  from: 'technologies',
                                  localField: 'TechnologyId',
                                  foreignField: '_id',
                                  as: 'technologies'
                              }
                          },
                          {
                              $lookup:
                              {
                                  from: 'databases',
                                  localField: 'DatabaseId',
                                  foreignField: '_id',
                                  as: 'databases'
                              }
                          },
                          {
                              $unwind:'$domains'
                          },
                          {
                              $unwind:'$databases'
                          },
                          {
                              $unwind:'$operatingsystems'
                          },
                          {
                              $project:
                              {
                                  'ProjectName': '$ProjectName',
                                  'TeamSize': '$TeamSize',
                                  'Description': '$Description',
                                  'OtherTools': '$OtherTools',
                                  'IsActive': '$IsActive',
                                  'IsDelete': '$IsDelete',                                
                                  'DatabaseId': '$DatabaseId',
                                  'DomainId': '$DomainId',
                                  'OperatingSystemId': '$OperatingSystemId',
                                  'TechnologyId': '$TechnologyId',
                                  'DomainName': '$domains.DomainName',
                                  'OperatingSystemName': '$operatingsystems.OperatingSystemName',
                                  'DatabaseName': '$databases.DatabaseName',
                                  'TechnologyName': '$technologies.TechnologyName',
                                  'databases': '$databases',
                                  'domains': '$domains',
                                  'operatingsystems': '$operatingsystems',
                                  'technologies': '$technologies'
                              }
                          },
                          {
                              $match:
                                  { 'IsDelete': false }
                          },
                          {
                              $sort:
                                  { 'ProjectName': 1 }
                          }
                      ], function(err, data) {
                            if(err) {
                                res.send(err);
                                logger.error(err.message);
                            }

                            redisCache.set(constants.PROJECTGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                                  if (err) {
                                      logger.error(err +  '-' + constants.PROJECT_DELETE);
                                      throw err;
                                  }

                                  redisCache.set(constants.PROJECTACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                      if (err) {
                                          logger.error(err + '-' + constants.PROJECT_DELETE);
                                          throw err;
                                      }
                                  });
                            });

                            response = { data: data, 'message' : constants.OK };
                            res.json(response);
                        });
                    }
                }
            );
        }
    });
};

exports.projectGetAll = projectGetAll;
exports.projectGetById = projectGetById;
exports.projectActiveGetAll = projectActiveGetAll;
exports.projectInsert = projectInsert;
exports.projectUpdate = projectUpdate;
exports.projectDelete = projectDelete;