var Technology = require('./../Models/Technology.js');
var Project = require('./../Models/Project.js');
var Candidate = require('./../Models/Candidate.js');
var constants = require('./../Constants/Constants.js');
var commonFunctions = require('./../Common/CommonFunctions.js');
var redisCache = require('./../public/Cache.js');
/* log4js*/
var log4js = require('log4js');
log4js.configure('./log4js.json');
var logger = log4js.getLogger('rms-appender');

let technologyGetAll = (req, res) => {
    redisCache.wrap(constants.TECHNOLOGYGETALL_CACHEKEY, function (cacheCb) {
        Technology.find({ IsDelete: false }, cacheCb).sort({ 'TechnologyName': 1 });
    }, commonFunctions.responder(res));
};

let technologyGetById = (req, res) => {
    let id = req.params.id;
    var cacheKey = constants.TECHNOLOGY_CACHEKEY + id;
    redisCache.wrap(cacheKey, function (cacheCb) {
        Technology.findOne({ _id: id }, cacheCb);
    }, commonFunctions.responder(res));
};

let technologyActiveGetAll = (req, res) => {
    redisCache.wrap(constants.TECHNOLOGYACTIVEGETALL_CACHEKEY, function (cacheCb) {
        Technology.find({ IsActive: true, IsDelete: false }, cacheCb).sort({ 'TechnologyName': 1 });
    }, commonFunctions.responder(res));
};

let technologyInsert = (req, res) => {
    var technologySchema = new Technology({
        TechnologyName: req.body.TechnologyName,
        IsActive: req.body.IsActive,
        IsDelete: false
    });

    Technology.find({ TechnologyName: req.body.TechnologyName, _id: { $ne: req.body._id }, IsDelete: false }, function(err, data) {
        if (data.length) {
            response = { data: data, 'message' : constants.CONFLICT };
            res.send(response);
        }
        else {
            technologySchema.save(function(err) {
                if(err) {
                    logger.error(err.message);
                }
                else {
                    Technology.find({ IsDelete: false }, function(err, data) {
                        if(err) {
                            res.send(err);
                            logger.error(err.message);
                        }

                        redisCache.set(constants.TECHNOLOGYGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                              if (err) {
                                  logger.error(err + '-' + constants.TECHNOLOGY_INSERT);
                                  throw err;
                              }

                              redisCache.set(constants.TECHNOLOGYACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                  if (err) {
                                      logger.error(err +  '-' + constants.TECHNOLOGY_INSERT);
                                      throw err;
                                  }
                              });
                        });

                        response = { data: data, 'message' : constants.OK };
                        res.json(response);
                    }).sort({ 'TechnologyName': 1 });
                }
            });
        }
    });
};

let technologyUpdate = (req, res) => {
    Technology.find({ TechnologyName: req.body.TechnologyName, _id: { $ne: req.body._id }, IsDelete: false }, function(err, data) {
        if (data.length) {
            response = { data: data, 'message' : constants.CONFLICT };
            res.send(response);
        }
        else {
            Technology.update({ _id: req.body._id }, { $set: { TechnologyName: req.body.TechnologyName, IsActive: req.body.IsActive, IsDelete: req.body.IsDelete } },
                function(err) {
                    if(err) {
                        logger.error(err.message);
                    }
                    else {
                        Technology.find({ IsDelete: false }, function(err, data) {
                            if(err) {
                                res.send(err);
                                logger.error(err.message);
                            }

                            var cacheKey = constants.TECHNOLOGY_CACHEKEY + req.body._id;
                            redisCache.set(cacheKey, data.filter(x=>x._id == req.body._id)[0], {ttl: 1}, function(err) {
                                if (err) {
                                    logger.error(err + '-' + constants.TECHNOLOGY_UPDATE);
                                    throw err;
                                }

                                redisCache.set(constants.TECHNOLOGYGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                                    if (err) {
                                        logger.error(err + '-' + constants.TECHNOLOGY_UPDATE);
                                        throw err;
                                    }

                                    redisCache.set(constants.TECHNOLOGYACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                        if (err) {
                                            logger.error(err + '-' + constants.TECHNOLOGY_UPDATE);
                                            throw err;
                                        }
                                    });
                                });
                            });

                            response = { data: data, 'message' : constants.OK };
                            res.json(response);
                        }).sort({ 'TechnologyName': 1 });
                    }
                }
            );
        }
    });
};

let technologyDelete = (req, res) => {
    var conflictStatus = 0;
    Project.find({ TechnologyId: req.params.id }, function(err, data) {
        Candidate.find({ TechnologyId: req.params.id }, function(err, result) {
            if (data.length || result.length) {
                conflictStatus = 1;
            }
            if (conflictStatus === 1) {
                response = { data: [], 'message' : constants.CONFLICT };
                res.json(response);
            }
            else {
                Technology.update({ _id: req.params.id }, { $set: { IsDelete: true } },
                    function(err) {
                        if(err) {
                            logger.error(err.message);
                        }
                        else {
                            Technology.find({ IsDelete: false }, function(err, data) {
                                if(err) {
                                    res.send(err);
                                    logger.error(err.message);
                                }

                                redisCache.set(constants.TECHNOLOGYGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                                      if (err) {
                                          logger.error(err +  '-' + constants.TECHNOLOGY_DELETE);
                                          throw err;
                                      }

                                      redisCache.set(constants.TECHNOLOGYACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                          if (err) {
                                              logger.error(err + '-' + constants.TECHNOLOGY_DELETE);
                                              throw err;
                                          }
                                      });
                                });

                                response = { data: data, 'message' : constants.OK };
                                res.json(response);
                            }).sort({ 'TechnologyName': 1 });
                        }
                    }
                );
            }
        });
    });
};

exports.technologyGetAll = technologyGetAll;
exports.technologyGetById = technologyGetById;
exports.technologyActiveGetAll = technologyActiveGetAll;
exports.technologyInsert = technologyInsert;
exports.technologyUpdate = technologyUpdate;
exports.technologyDelete = technologyDelete;