var Domain = require('./../Models/Domain.js');
var Project = require('./../Models/Project.js');
var Candidate = require('./../Models/Candidate.js');
var constants = require('./../Constants/Constants.js');
var commonFunctions = require('./../Common/CommonFunctions.js');
var redisCache = require('./../public/Cache.js');
/* log4js*/
var log4js = require('log4js');
log4js.configure('./log4js.json');
var logger = log4js.getLogger('rms-appender');

let domainGetAll = (req, res) => {
    redisCache.wrap(constants.DOMAINGETALL_CACHEKEY, function (cacheCb) {
        Domain.find({ IsDelete: false }, cacheCb).sort({ 'DomainName': 1 });
    }, commonFunctions.responder(res));
};

let domainGetById = (req, res) => {
    let id = req.params.id;
    var cacheKey = constants.DOMAIN_CACHEKEY + id;
    redisCache.wrap(cacheKey, function (cacheCb) {
        Domain.findOne({ _id: id }, cacheCb);
    }, commonFunctions.responder(res));
};

let domainActiveGetAll = (req, res) => {
  redisCache.wrap(constants.DOMAINACTIVEGETALL_CACHEKEY, function (cacheCb) {
      Domain.find({ IsActive: true, IsDelete: false }, cacheCb).sort({ 'DomainName': 1 });
  }, commonFunctions.responder(res));
};

let domainInsert = (req, res) => {
    var domainSchema = new Domain({
        DomainName: req.body.DomainName,
        IsActive: req.body.IsActive,
        IsDelete: false
    });

    Domain.find({ DomainName: req.body.DomainName, _id: { $ne: req.body._id }, IsDelete: false }, function(err, data) {
        if (data.length) {
            response = { data: data, 'message' : constants.CONFLICT };
            res.send(response);
        }
        else {
            domainSchema.save(function(err) {
                if(err) {
                    logger.error(err.message);
                }
                else {
                    Domain.find({ IsDelete: false }, function(err, data) {
                        if(err) {
                            res.send(err);
                            logger.error(err.message);
                        }

                        redisCache.set(constants.DOMAINGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                              if (err) {
                                  logger.error(err + '-' + constants.DOMAIN_INSERT);
                                  throw err;
                              }

                              redisCache.set(constants.DOMAINACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                  if (err) {
                                      logger.error(err +  '-' + constants.DOMAIN_INSERT);
                                      throw err;
                                  }
                              });
                        });

                        response = { data: data, 'message' : constants.OK };
                        res.json(response);
                    }).sort({ 'DomainName': 1 });
                }
            });
        }
    });
};

let domainUpdate = (req, res) => {
    Domain.find({ DomainName: req.body.DomainName, _id:{ $ne: req.body._id }, IsDelete: false }, function(err, data) {
        if (data.length) {
            response = { data: data, 'message' : constants.CONFLICT };
            res.send(response);
        }
        else {
            Domain.update({ _id: req.body._id }, { $set: { DomainName: req.body.DomainName, IsActive: req.body.IsActive, IsDelete: req.body.IsDelete } },
                function(err) {
                    if(err) {
                        logger.error(err.message);
                    }
                    else {
                        Domain.find({ IsDelete: false }, function(err, data) {
                            if(err) {
                                res.send(err);
                                logger.error(err.message);
                            }

                            var cacheKey = constants.DOMAIN_CACHEKEY + req.body._id;
                            redisCache.set(cacheKey, data.filter(x=>x._id == req.body._id)[0], {ttl: 1}, function(err) {
                                if (err) {
                                    logger.error(err + '-' + constants.DOMAIN_UPDATE);
                                    throw err;
                                }

                                redisCache.set(constants.DOMAINGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                                    if (err) {
                                        logger.error(err + '-' + constants.DOMAIN_UPDATE);
                                        throw err;
                                    }

                                    redisCache.set(constants.DOMAINACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                        if (err) {
                                            logger.error(err + '-' + constants.DOMAIN_UPDATE);
                                            throw err;
                                        }
                                    });
                                });
                            });

                            response = { data: data, 'message' : constants.OK };
                            res.json(response);
                        }).sort({ 'DomainName': 1 });
                    }
                }
            );
        }
    });
};

let domainDelete = (req, res) => {
    var conflictStatus = 0;
    Project.find({ DomainId: req.params.id }, function(err, data) {
        Candidate.find({ DomainId: req.params.id }, function(err, result) {
            if (data.length || result.length) {
                conflictStatus = 1;
            }
            if (conflictStatus === 1) {
                response = { data: [], 'message' : constants.CONFLICT };
                res.json(response);
            }
            else {
                Domain.update({ _id: req.params.id }, { $set: { IsDelete: true } },
                    function(err) {
                        if(err) {
                            logger.error(err.message);
                        }
                        else {
                            Domain.find({ IsDelete: false }, function(err, data) {
                                if(err) {
                                    res.send(err);
                                    logger.error(err.message);
                                }

                                redisCache.set(constants.DOMAINGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                                      if (err) {
                                          logger.error(err +  '-' + constants.DOMAIN_DELETE);
                                          throw err;
                                      }

                                      redisCache.set(constants.DOMAINACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                          if (err) {
                                              logger.error(err + '-' + constants.DOMAIN_DELETE);
                                              throw err;
                                          }
                                      });
                                });

                                response = { data: data, 'message' : constants.OK };
                                res.json(response);
                            }).sort({ 'DomainName': 1 });
                        }
                    }
                );
            }
        });
    });
};

exports.domainGetAll = domainGetAll;
exports.domainGetById = domainGetById;
exports.domainActiveGetAll = domainActiveGetAll;
exports.domainInsert = domainInsert;
exports.domainUpdate = domainUpdate;
exports.domainDelete = domainDelete;