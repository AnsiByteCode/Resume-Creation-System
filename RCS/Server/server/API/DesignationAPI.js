var Designation = require('./../Models/Designation.js');
var Candidate = require('./../Models/Candidate.js');
var constants = require('./../Constants/Constants.js');
var commonFunctions = require('./../Common/CommonFunctions.js');
var redisCache = require('./../public/Cache.js');
/* log4js*/
var log4js = require('log4js');
log4js.configure('./log4js.json');
var logger = log4js.getLogger('rms-appender');

let designationGetAll = (req, res) => {
    redisCache.wrap(constants.DESIGNATIONGETALL_CACHEKEY, function (cacheCb) {
        Designation.find({ IsDelete: false }, cacheCb).sort({ 'DesignationName': 1 });
    }, commonFunctions.responder(res));
};

let designationGetById = (req, res) => {
    let id = req.params.id;
    var cacheKey = constants.DESIGNATION_CACHEKEY + id;
    redisCache.wrap(cacheKey, function (cacheCb) {
        Designation.findOne({ _id: id }, cacheCb);
    }, commonFunctions.responder(res));
};

let designationActiveGetAll = (req, res) => {
    redisCache.wrap(constants.DESIGNATIONACTIVEGETALL_CACHEKEY, function (cacheCb) {
        Designation.find({ IsActive: true, IsDelete: false }, cacheCb).sort({ 'DesignationName': 1 });
    }, commonFunctions.responder(res));
};

let designationInsert = (req, res) => {
    var designationSchema = new Designation({
        DesignationName: req.body.DesignationName,
        IsActive: req.body.IsActive,
        IsDelete: false
    });

    Designation.find({ DesignationName: req.body.DesignationName, _id: { $ne: req.body._id }, IsDelete: false }, function(err, data) {
        if (data.length) {
            response = { data: data, 'message' : constants.CONFLICT };
            res.send(response);
        }
        else {
            designationSchema.save(function(err) {
                if(err) {
                    logger.error(err.message);
                }
                else {
                    Designation.find({ IsDelete: false }, function(err, data) {
                        if(err) {
                            res.send(err);
                            logger.error(err.message);
                        }

                        redisCache.set(constants.DESIGNATIONGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                              if (err) {
                                  logger.error(err + '-' + constants.DESIGNATION_INSERT);
                                  throw err;
                              }

                              redisCache.set(constants.DESIGNATIONACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                  if (err) {
                                      logger.error(err +  '-' + constants.DESIGNATION_INSERT);
                                      throw err;
                                  }
                              });
                        });

                        response = { data: data, 'message' : constants.OK };
                        res.json(response);
                    }).sort({ 'DesignationName': 1 });
                }
            });
        }
    });
};

let designationUpdate = (req, res) => {
    Designation.find({ DesignationName: req.body.DesignationName, _id:{ $ne: req.body._id }, IsDelete: false }, function(err, data) {
        if (data.length) {
            response = { data: data, 'message' : constants.CONFLICT };
            res.send(response);
        }
        else {
            Designation.update({ _id: req.body._id }, { $set: { DesignationName: req.body.DesignationName, IsActive: req.body.IsActive, IsDelete: req.body.IsDelete } },
                function(err) {
                    if(err) {
                        logger.error(err.message);
                    }
                    else {
                        Designation.find({ IsDelete: false }, function(err, data) {
                            if(err) {
                                res.send(err);
                                logger.error(err.message);
                            }

                            var cacheKey = constants.DESIGNATION_CACHEKEY + req.body._id;
                            redisCache.set(cacheKey, data.filter(x=>x._id == req.body._id)[0], {ttl: 1}, function(err) {
                                if (err) {
                                    logger.error(err + '-' + constants.DESIGNATION_UPDATE);
                                    throw err;
                                }

                                redisCache.set(constants.DESIGNATIONGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                                    if (err) {
                                        logger.error(err + '-' + constants.DESIGNATION_UPDATE);
                                        throw err;
                                    }

                                    redisCache.set(constants.DESIGNATIONACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                        if (err) {
                                            logger.error(err + '-' + constants.DESIGNATION_UPDATE);
                                            throw err;
                                        }
                                    });
                                });
                            });

                            response = { data: data, 'message' : constants.OK };
                            res.json(response);
                        }).sort({ 'DesignationName': 1 });
                    }
                }
            );
        }
    });
};

let designationDelete = (req, res) => {
    var conflictStatus = 0;
    Candidate.find({ DesignationId: req.params.id }, function(err, result) {
        if (result.length) {
            conflictStatus = 1;
        }
        if (conflictStatus === 1) {
            response = { data: [], 'message' : constants.CONFLICT };
            res.json(response);
        }
        else {
            Designation.update({_id: req.params.id}, { $set: { IsDelete: true } },
                function(err) {
                    if(err) {
                        logger.error(err.message);
                    }
                    else {
                        Designation.find({ IsDelete: false }, function(err, data) {
                            if(err) {
                                res.send(err);
                                logger.error(err.message);
                            }

                            redisCache.set(constants.DESIGNATIONGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                                  if (err) {
                                      logger.error(err +  '-' + constants.DESIGNATION_DELETE);
                                      throw err;
                                  }

                                  redisCache.set(constants.DESIGNATIONACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                      if (err) {
                                          logger.error(err + '-' + constants.DESIGNATION_DELETE);
                                          throw err;
                                      }
                                  });
                            });

                            response = { data: data, 'message' : constants.OK };
                            res.json(response);
                        }).sort({ 'DesignationName': 1 });
                    }
                }
            );
        }
    });
};

exports.designationGetAll = designationGetAll;
exports.designationGetById = designationGetById;
exports.designationActiveGetAll = designationActiveGetAll;
exports.designationInsert = designationInsert;
exports.designationUpdate = designationUpdate;
exports.designationDelete = designationDelete;