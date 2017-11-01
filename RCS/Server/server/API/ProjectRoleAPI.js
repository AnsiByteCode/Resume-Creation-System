var ProjectRole = require('./../Models/ProjectRole.js');
var ProjectDetails = require('./../Models/ProjectDetails.js');
var constants = require('./../Constants/Constants.js');
var commonFunctions = require('./../Common/CommonFunctions.js');
var redisCache = require('./../public/Cache.js');
/* log4js*/
var log4js = require('log4js');
log4js.configure('./log4js.json');
var logger = log4js.getLogger('rms-appender');

let projectRoleGetAll = (req, res) => {
    redisCache.wrap(constants.PROJECTROLEGETALL_CACHEKEY, function (cacheCb) {
        ProjectRole.find({ IsDelete: false }, cacheCb).sort({ 'ProjectRoleName': 1 });
    }, commonFunctions.responder(res));
};

let projectRoleGetById = (req, res) => {
    let id = req.params.id;
    var cacheKey = constants.PROJECTROLE_CACHEKEY + id;
    redisCache.wrap(cacheKey, function (cacheCb) {
        ProjectRole.findOne({ _id: id }, cacheCb);
    }, commonFunctions.responder(res));
};

let projectRoleActiveGetAll = (req, res) => {
    redisCache.wrap(constants.PROJECTROLEACTIVEGETALL_CACHEKEY, function (cacheCb) {
        ProjectRole.find({ IsActive: true, IsDelete: false }, cacheCb).sort({ 'ProjectRoleName': 1 });
    }, commonFunctions.responder(res));
};

let projectRoleInsert = (req, res) => {
    var projectRoleSchema = new ProjectRole({
        ProjectRoleName: req.body.ProjectRoleName,
        IsActive: req.body.IsActive,
        IsDelete: false
    });

    ProjectRole.find({ ProjectRoleName: req.body.ProjectRoleName, _id: { $ne: req.body._id }, IsDelete: false }, function(err, data) {
        if (data.length) {
            response = { data: data, 'message' : constants.CONFLICT };
            res.send(response);
        }
        else {
            projectRoleSchema.save(function(err) {
                if(err) {
                    logger.error(err.message);
                }
                else {
                    ProjectRole.find({ IsDelete: false }, function(err, data) {
                        if(err) {
                            res.send(err);
                            logger.error(err.message);
                        }

                        redisCache.set(constants.PROJECTROLEGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                              if (err) {
                                  logger.error(err + '-' + constants.PROJECTROLE_INSERT);
                                  throw err;
                              }

                              redisCache.set(constants.PROJECTROLEACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                  if (err) {
                                      logger.error(err +  '-' + constants.PROJECTROLE_INSERT);
                                      throw err;
                                  }
                              });
                        });

                        response = { data: data, 'message' : constants.OK };
                        res.json(response);
                    }).sort({ 'ProjectRoleName': 1 });
                }
            });
        }
    });
};

let projectRoleUpdate = (req, res) => {
    ProjectRole.find({ ProjectRoleName: req.body.ProjectRoleName, _id: { $ne: req.body._id }, IsDelete: false }, function(err, data) {
        if (data.length) {
            response = { data: data, 'message' : constants.CONFLICT };
            res.send(response);
        }
        else {
            ProjectRole.update({ _id: req.body._id }, { $set: { ProjectRoleName: req.body.ProjectRoleName, IsActive: req.body.IsActive, IsDelete: req.body.IsDelete } },
                function(err) {
                    if(err) {
                        logger.error(err.message);
                    }
                    else {
                        ProjectRole.find({ IsDelete: false }, function(err, data) {
                            if(err) {
                                res.send(err);
                                logger.error(err.message);
                            }

                            var cacheKey = constants.PROJECTROLE_CACHEKEY + req.body._id;
                            redisCache.set(cacheKey, data.filter(x=>x._id == req.body._id)[0], {ttl: 1}, function(err) {
                                if (err) {
                                    logger.error(err + '-' + constants.PROJECTROLE_UPDATE);
                                    throw err;
                                }

                                redisCache.set(constants.PROJECTROLEGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                                    if (err) {
                                        logger.error(err + '-' + constants.PROJECTROLE_UPDATE);
                                        throw err;
                                    }

                                    redisCache.set(constants.PROJECTROLEACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                        if (err) {
                                            logger.error(err + '-' + constants.PROJECTROLE_UPDATE);
                                            throw err;
                                        }
                                    });
                                });
                            });

                            response = { data: data, 'message' : constants.OK };
                            res.json(response);
                        }).sort({ 'ProjectRoleName': 1 });
                    }
                }
            );
        }
    });
};

let projectRoleDelete = (req, res) => {
    var conflictStatus = 0;
    ProjectDetails.find({ RoleId: req.params.id }, function(err, data) {
        if (data.length) {
            conflictStatus = 1;
        }
        if (conflictStatus === 1) {
            response = { data: [], 'message' : constants.CONFLICT };
            res.json(response);
        }
        else {
            ProjectRole.update({ _id: req.params.id }, { $set: { IsDelete: true } },
                function(err) {
                    if(err) {
                        logger.error(err.message);
                    }
                    else {
                        ProjectRole.find({ IsDelete: false }, function(err, data) {
                            if(err) {
                                res.send(err);
                                logger.error(err.message);
                            }

                            redisCache.set(constants.PROJECTROLEGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                                  if (err) {
                                      logger.error(err +  '-' + constants.PROJECTROLE_DELETE);
                                      throw err;
                                  }

                                  redisCache.set(constants.PROJECTROLEACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                      if (err) {
                                          logger.error(err + '-' + constants.PROJECTROLE_DELETE);
                                          throw err;
                                      }
                                  });
                            });

                            response = { data: data, 'message' : constants.OK };
                            res.json(response);
                        }).sort({ 'ProjectRoleName': 1 });
                    }
                }
            );
        }
    });
};

exports.projectRoleGetAll = projectRoleGetAll;
exports.projectRoleGetById = projectRoleGetById;
exports.projectRoleActiveGetAll = projectRoleActiveGetAll;
exports.projectRoleInsert = projectRoleInsert;
exports.projectRoleUpdate = projectRoleUpdate;
exports.projectRoleDelete = projectRoleDelete;