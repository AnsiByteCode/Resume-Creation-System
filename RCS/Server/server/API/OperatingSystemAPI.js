var OperatingSystem = require('./../Models/OperatingSystem.js');
var Project = require('./../Models/Project.js');
var Candidate = require('./../Models/Candidate.js');
var constants = require('./../Constants/Constants.js');
var commonFunctions = require('./../Common/CommonFunctions.js');
var redisCache = require('./../public/Cache.js');
/* log4js*/
var log4js = require('log4js');
log4js.configure('./log4js.json');
var logger = log4js.getLogger('rms-appender');

let operatingSystemGetAll = (req, res) => {
    redisCache.wrap(constants.OPERATINGSYSTEMGETALL_CACHEKEY, function (cacheCb) {
        OperatingSystem.find({ IsDelete: false }, cacheCb).sort({ 'OperatingSystemName': 1 });
    }, commonFunctions.responder(res));
};

let operatingSystemGetById = (req, res) => {
    let id = req.params.id;
    var cacheKey = constants.OPERATINGSYSTEM_CACHEKEY + id;
    redisCache.wrap(cacheKey, function (cacheCb) {
        OperatingSystem.findOne({ _id: id }, cacheCb);
    }, commonFunctions.responder(res));
};

let operatingSystemActiveGetAll = (req, res) => {
    redisCache.wrap(constants.OPERATINGSYSTEMACTIVEGETALL_CACHEKEY, function (cacheCb) {
        OperatingSystem.find({ IsActive: true, IsDelete: false }, cacheCb).sort({ 'OperatingSystemName': 1 });
    }, commonFunctions.responder(res));
};

let operatingSystemInsert = (req, res) => {
    var operatingSystemSchema = new OperatingSystem({
        OperatingSystemName: req.body.OperatingSystemName,
        IsActive: req.body.IsActive,
        IsDelete: false
    });

    OperatingSystem.find({ OperatingSystemName: req.body.OperatingSystemName, _id: { $ne: req.body._id }, IsDelete: false }, function(err, data) {
        if (data.length) {
            response = { data: data, 'message' : constants.CONFLICT };
            res.send(response);
        }
        else {
            operatingSystemSchema.save(function(err) {
                if(err) {
                    logger.error(err.message);
                }
                else {
                    OperatingSystem.find({ IsDelete: false }, function(err, data) {
                        if(err) {
                            res.send(err);
                            logger.error(err.message);
                        }

                        redisCache.set(constants.OPERATINGSYSTEMGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                              if (err) {
                                  logger.error(err + '-' + constants.OPERATINGSYSTEM_INSERT);
                                  throw err;
                              }

                              redisCache.set(constants.OPERATINGSYSTEMACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                  if (err) {
                                      logger.error(err +  '-' + constants.OPERATINGSYSTEM_INSERT);
                                      throw err;
                                  }
                              });
                        });

                        response = { data: data, 'message' : constants.OK };
                        res.json(response);
                    }).sort({ 'OperatingSystemName': 1 });
                }
            });
        }
    });
};

let operatingSystemUpdate = (req, res) => {
    OperatingSystem.find({ OperatingSystemName: req.body.OperatingSystemName, _id: { $ne: req.body._id }, IsDelete: false }, function(err, data) {
        if (data.length) {
            response = { data: data, 'message' : constants.CONFLICT };
            res.send(response);
        }
        else {
            OperatingSystem.update({ _id: req.body._id }, { $set: { OperatingSystemName: req.body.OperatingSystemName, IsActive: req.body.IsActive, IsDelete: req.body.IsDelete } },
                function(err) {
                    if(err) {
                        logger.error(err.message);
                    }
                    else {
                        OperatingSystem.find({ IsDelete: false }, function(err, data) {
                            if(err) {
                                res.send(err);
                                logger.error(err.message);
                            }

                            var cacheKey = constants.OPERATINGSYSTEM_CACHEKEY + req.body._id;
                            redisCache.set(cacheKey, data.filter(x=>x._id == req.body._id)[0], {ttl: 1}, function(err) {
                                if (err) {
                                    logger.error(err + '-' + constants.OPERATINGSYSTEM_UPDATE);
                                    throw err;
                                }

                                redisCache.set(constants.OPERATINGSYSTEMGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                                    if (err) {
                                        logger.error(err + '-' + constants.OPERATINGSYSTEM_UPDATE);
                                        throw err;
                                    }

                                    redisCache.set(constants.OPERATINGSYSTEMACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                        if (err) {
                                            logger.error(err + '-' + constants.OPERATINGSYSTEM_UPDATE);
                                            throw err;
                                        }
                                    });
                                });
                            });

                            response = { data: data, 'message' : constants.OK };
                            res.json(response);
                        }).sort({ 'OperatingSystemName': 1 });
                    }
                }
            );
        }
    });
};

let operatingSystemDelete = (req, res) => {
    var conflictStatus = 0;
    Project.find({ OperatingSystemId: req.params.id }, function(err, data) {
        Candidate.find({ OperatingSystemId: req.params.id }, function(err, result) {
            if (data.length || result.length) {
                conflictStatus = 1;
            }
            if (conflictStatus === 1) {
                response = { data: [], 'message' : constants.CONFLICT };
                res.json(response);
            }
            else {
                OperatingSystem.update({ _id: req.params.id }, { $set: { IsDelete: true } },
                    function(err) {
                        if(err) {
                            logger.error(err.message);
                        }
                        else {
                            OperatingSystem.find({ IsDelete: false }, function(err, data) {
                                if(err) {
                                    res.send(err);
                                    logger.error(err.message);
                                }

                                redisCache.set(constants.OPERATINGSYSTEMGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                                      if (err) {
                                          logger.error(err +  '-' + constants.OPERATINGSYSTEM_DELETE);
                                          throw err;
                                      }

                                      redisCache.set(constants.OPERATINGSYSTEMACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                          if (err) {
                                              logger.error(err + '-' + constants.OPERATINGSYSTEM_DELETE);
                                              throw err;
                                          }
                                      });
                                });

                                response = { data: data, 'message' : constants.OK };
                                res.json(response);
                            }).sort({ 'OperatingSystemName': 1 });
                        }
                    }
                );
            }
        });
    });
};

exports.operatingSystemGetAll = operatingSystemGetAll;
exports.operatingSystemGetById = operatingSystemGetById;
exports.operatingSystemActiveGetAll = operatingSystemActiveGetAll;
exports.operatingSystemInsert = operatingSystemInsert;
exports.operatingSystemUpdate = operatingSystemUpdate;
exports.operatingSystemDelete = operatingSystemDelete;