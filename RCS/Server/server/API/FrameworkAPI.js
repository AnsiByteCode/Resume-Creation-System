var Framework = require('./../Models/Framework.js');
var Candidate = require('./../Models/Candidate.js');
var constants = require('./../Constants/Constants.js');
var commonFunctions = require('./../Common/CommonFunctions.js');
var redisCache = require('./../public/Cache.js');
/* log4js*/
var log4js = require('log4js');
log4js.configure('./log4js.json');
var logger = log4js.getLogger('rms-appender');

let frameworkGetAll = (req, res) => {
    redisCache.wrap(constants.FRAMEWORKGETALL_CACHEKEY, function (cacheCb) {
        Framework.find({ IsDelete: false }, cacheCb).sort({ 'FrameworkName': 1 });
    }, commonFunctions.responder(res));
};

let frameworkGetById = (req, res) => {
    let id = req.params.id;
    var cacheKey = constants.FRAMEWORK_CACHEKEY + id;
    redisCache.wrap(cacheKey, function (cacheCb) {
        Framework.findOne({ _id: id }, cacheCb);
    }, commonFunctions.responder(res));
};

let frameworkActiveGetAll = (req, res) => {
    redisCache.wrap(constants.FRAMEWORKACTIVEGETALL_CACHEKEY, function (cacheCb) {
        Framework.find({ IsActive: true, IsDelete: false }, cacheCb).sort({ 'FrameworkName': 1 });
    }, commonFunctions.responder(res));
};

let frameworkInsert = (req, res) => {
    var frameworkSchema = new Framework({
        FrameworkName: req.body.FrameworkName,
        IsActive: req.body.IsActive
    });

    Framework.find({ FrameworkName: req.body.FrameworkName, _id: { $ne: req.body._id }, IsDelete: false }, function(err, data) {
        if (data.length) {
            response = { data: data, 'message' : constants.CONFLICT };
            res.send(response);
        }
        else {
            frameworkSchema.save(function(err) {
                if(err) {
                    logger.error(err.message);
                }
                else {
                    Framework.find({ IsDelete: false }, function(err, data) {
                        if(err) {
                            res.send(err);
                            logger.error(err.message);
                        }

                        redisCache.set(constants.FRAMEWORKGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                              if (err) {
                                  logger.error(err + '-' + constants.FRAMEWORK_INSERT);
                                  throw err;
                              }

                              redisCache.set(constants.FRAMEWORKACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                  if (err) {
                                      logger.error(err +  '-' + constants.FRAMEWORK_INSERT);
                                      throw err;
                                  }
                              });
                        });

                        response = { data: data, 'message' : constants.OK };
                        res.json(response);
                    }).sort({ 'FrameworkName': 1 });
                }
            });
        }
    });
};

let frameworkUpdate = (req, res) => {
    Framework.find({ FrameworkName: req.body.FrameworkName, _id: { $ne: req.body._id }, IsDelete: false }, function(err, data) {
        if (data.length) {
            response = { data: data, 'message' : constants.CONFLICT };
            res.send(response);
        }
        else {
            Framework.update({ _id: req.body._id }, { $set: { FrameworkName: req.body.FrameworkName, IsActive: req.body.IsActive, IsDelete: req.body.IsDelete } },
                function(err) {
                    if(err) {
                        logger.error(err.message);
                    }
                    else {
                        Framework.find({ IsDelete: false }, function(err, data) {
                            if(err) {
                                res.send(err);
                                logger.error(err.message);
                            }

                            var cacheKey = constants.FRAMEWORK_CACHEKEY + req.body._id;
                            redisCache.set(cacheKey, data.filter(x=>x._id == req.body._id)[0], {ttl: 1}, function(err) {
                                if (err) {
                                    logger.error(err + '-' + constants.FRAMEWORK_UPDATE);
                                    throw err;
                                }

                                redisCache.set(constants.FRAMEWORKGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                                    if (err) {
                                        logger.error(err + '-' + constants.FRAMEWORK_UPDATE);
                                        throw err;
                                    }

                                    redisCache.set(constants.FRAMEWORKACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                        if (err) {
                                            logger.error(err + '-' + constants.FRAMEWORK_UPDATE);
                                            throw err;
                                        }
                                    });
                                });
                            });

                            response = { data: data, 'message' : constants.OK };
                            res.json(response);
                        }).sort({ 'FrameworkName': 1 });
                    }
                }
            );
        }
    });
};

let frameworkDelete = (req, res) => {
    var conflictStatus = 0;
    Candidate.find({ FrameworkId: req.params.id }, function(err, result) {
        if (result.length) {
            conflictStatus = 1;
        }
        if (conflictStatus === 1) {
            response = { data: [], 'message' : constants.CONFLICT };
            res.json(response);
        }
        else {
            Framework.update({ _id: req.params.id }, { $set: { IsDelete: true } },
                function(err) {
                    if(err) {
                        logger.error(err.message);
                    }
                    else {
                        Framework.find({ IsDelete: false }, function(err, data) {
                            if(err) {
                                res.send(err);
                                logger.error(err.message);
                            }

                            redisCache.set(constants.FRAMEWORKGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                                  if (err) {
                                      logger.error(err +  '-' + constants.FRAMEWORK_DELETE);
                                      throw err;
                                  }

                                  redisCache.set(constants.FRAMEWORKACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                      if (err) {
                                          logger.error(err + '-' + constants.FRAMEWORK_DELETE);
                                          throw err;
                                      }
                                  });
                            });

                            response = { data: data, 'message' : constants.OK };
                            res.json(response);
                        }).sort({ 'FrameworkName': 1 });
                    }
                }
            );
        }
    });
};

exports.frameworkGetAll = frameworkGetAll;
exports.frameworkGetById = frameworkGetById;
exports.frameworkActiveGetAll = frameworkActiveGetAll;
exports.frameworkInsert = frameworkInsert;
exports.frameworkUpdate = frameworkUpdate;
exports.frameworkDelete = frameworkDelete;