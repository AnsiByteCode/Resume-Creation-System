var Application = require('./../Models/Application.js');
var Candidate = require('./../Models/Candidate.js');
var constants = require('./../Constants/Constants.js');
var commonFunctions = require('./../Common/CommonFunctions.js');
var redisCache = require('./../public/Cache.js');
/* log4js*/
var log4js = require('log4js');
log4js.configure('./log4js.json');
var logger = log4js.getLogger('rms-appender');

let applicationGetAll = (req, res) => {
    redisCache.wrap(constants.APPLICATIONGETALL_CACHEKEY, function (cacheCb) {
        Application.find({ IsDelete: false }, cacheCb).sort({ 'ApplicationName': 1 });
    }, commonFunctions.responder(res));
};

let applicationGetById = (req, res) => {
    let id = req.params.id;
    var cacheKey = constants.APPLICATION_CACHEKEY + id;
    redisCache.wrap(cacheKey, function (cacheCb) {
        Application.findOne({ _id: id }, cacheCb);
    }, commonFunctions.responder(res));
};

let applicationActiveGetAll = (req, res) => {
    redisCache.wrap(constants.APPLICATIONACTIVEGETALL_CACHEKEY, function (cacheCb) {
        Application.find({ IsActive: true, IsDelete: false }, cacheCb).sort({ 'ApplicationName': 1 });
    }, commonFunctions.responder(res));
};

let applicationInsert = (req, res) => {
    var applicationSchema = new Application({
        ApplicationName: req.body.ApplicationName,
        IsActive: req.body.IsActive,
        IsDelete: false
    });

    Application.find({ ApplicationName: req.body.ApplicationName, _id: { $ne: req.body._id }, IsDelete: false }, function(err, data) {
        if (data.length) {
            response = { data: data, 'message' : constants.CONFLICT };
            res.send(response);
        }
        else {
            applicationSchema.save(function(err) {
                if(err) {
                    logger.error(err.message);
                }
                else {
                    Application.find({ IsDelete: false }, function(err, data) {
                        if(err) {
                            res.send(err);
                            logger.error(err.message);
                        }

                        redisCache.set(constants.APPLICATIONGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                              if (err) {
                                  logger.error(err + '-' + constants.APPLICATION_INSERT);
                                  throw err;
                              }

                              redisCache.set(constants.APPLICATIONACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                  if (err) {
                                      logger.error(err +  '-' + constants.APPLICATION_INSERT);
                                      throw err;
                                  }
                              });
                        });

                        response = { data: data, 'message' : constants.OK };
                        res.json(response);
                    }).sort({ 'ApplicationName': 1 });
                }
            });
        }
    });
};

let applicationUpdate = (req, res) => {
    Application.find({ ApplicationName: req.body.ApplicationName, _id:{ $ne: req.body._id }, IsDelete: false }, function(err, data) {
        if (data.length) {
            response = { data: data, 'message' : constants.CONFLICT };
            res.send(response);
        }
        else {
            Application.update({ _id: req.body._id }, { $set: { ApplicationName: req.body.ApplicationName, IsActive: req.body.IsActive, IsDelete: req.body.IsDelete } },
                function(err) {
                    if(err) {
                        logger.error(err.message);
                    }
                    else {
                        Application.find({ IsDelete: false }, function(err, data) {
                            if(err) {
                                res.send(err);
                                logger.error(err.message);
                            }

                            var cacheKey = constants.APPLICATION_CACHEKEY + req.body._id;
                            redisCache.set(cacheKey, data.filter(x=>x._id == req.body._id)[0], {ttl: 1}, function(err) {
                                if (err) {
                                    logger.error(err + '-' + constants.APPLICATION_UPDATE);
                                    throw err;
                                }

                                redisCache.set(constants.APPLICATIONGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                                    if (err) {
                                        logger.error(err + '-' + constants.APPLICATION_UPDATE);
                                        throw err;
                                    }

                                    redisCache.set(constants.APPLICATIONACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                        if (err) {
                                            logger.error(err + '-' + constants.APPLICATION_UPDATE);
                                            throw err;
                                        }
                                    });
                                });
                            });

                            response = { data: data, 'message' : constants.OK };
                            res.json(response);
                        }).sort({ 'ApplicationName': 1 });
                    }
                }
            );
        }
    });
};

let applicationDelete = (req, res) => {
    var conflictStatus = 0;
    Candidate.find({ ApplicationId: req.params.id }, function(err, result) {
        if (result.length) {
            conflictStatus = 1;
        }
        if (conflictStatus === 1) {
            response = { data: [], 'message' : constants.CONFLICT };
            res.json(response);
        }
        else {
            Application.update({ _id: req.params.id }, { $set: { IsDelete: true } },
                function(err) {
                    if(err) {
                        logger.error(err.message);
                    }
                    else {
                        Application.find({ IsDelete: false }, function(err, data) {
                            if(err) {
                                res.send(err);
                                logger.error(err.message);
                            }

                            redisCache.set(constants.APPLICATIONGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                                  if (err) {
                                      logger.error(err +  '-' + constants.APPLICATION_DELETE);
                                      throw err;
                                  }

                                  redisCache.set(constants.APPLICATIONACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                      if (err) {
                                          logger.error(err + '-' + constants.APPLICATION_DELETE);
                                          throw err;
                                      }
                                  });
                            });

                            response = { data: data, 'message' : constants.OK };
                            res.json(response);
                        }).sort({ 'ApplicationName': 1 });
                    }
                }
            );
        }
    });
};

exports.applicationGetAll = applicationGetAll;
exports.applicationGetById = applicationGetById;
exports.applicationActiveGetAll = applicationActiveGetAll;
exports.applicationInsert = applicationInsert;
exports.applicationUpdate = applicationUpdate;
exports.applicationDelete = applicationDelete;