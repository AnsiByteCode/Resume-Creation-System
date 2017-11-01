var Language = require('./../Models/Language.js');
var Candidate = require('./../Models/Candidate.js');
var constants = require('./../Constants/Constants.js');
var commonFunctions = require('./../Common/CommonFunctions.js');
var redisCache = require('./../public/Cache.js');
/* log4js*/
var log4js = require('log4js');
log4js.configure('./log4js.json');
var logger = log4js.getLogger('rms-appender');

let languageGetAll = (req, res) => {
    redisCache.wrap(constants.LANGUAGEGETALL_CACHEKEY, function (cacheCb) {
        Language.find({ IsDelete: false }, cacheCb).sort({ 'LanguageName': 1 });
    }, commonFunctions.responder(res));
};

let languageGetById = (req, res) => {
    let id = req.params.id;
    var cacheKey = constants.LANGUAGE_CACHEKEY + id;
    redisCache.wrap(cacheKey, function (cacheCb) {
        Language.findOne({ _id: id }, cacheCb);
    }, commonFunctions.responder(res));
};

let languageActiveGetAll = (req, res) => {
    redisCache.wrap(constants.LANGUAGEACTIVEGETALL_CACHEKEY, function (cacheCb) {
        Language.find({ IsActive: true, IsDelete: false }, cacheCb).sort({ 'LanguageName': 1 });
    }, commonFunctions.responder(res));
};

let languageInsert = (req, res) => {
    var languageSchema = new Language({
        LanguageName: req.body.LanguageName,
        IsActive: req.body.IsActive,
        IsDelete: false
    });

    Language.find({ LanguageName: req.body.LanguageName, _id: { $ne: req.body._id }, IsDelete: false }, function(err, data) {
        if (data.length) {
            response = { data: data, 'message' : constants.CONFLICT };
            res.send(response);
        }
        else {
            languageSchema.save(function(err) {
                if(err) {
                    logger.error(err.message);
                }
                else {
                    Language.find({ IsDelete: false }, function(err, data) {
                        if(err) {
                            res.send(err);
                            logger.error(err.message);
                        }

                        redisCache.set(constants.LANGUAGEGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                              if (err) {
                                  logger.error(err + '-' + constants.LANGUAGE_INSERT);
                                  throw err;
                              }

                              redisCache.set(constants.LANGUAGEACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                  if (err) {
                                      logger.error(err +  '-' + constants.LANGUAGE_INSERT);
                                      throw err;
                                  }
                              });
                        });

                        response = { data: data, 'message' : constants.OK };
                        res.json(response);
                    }).sort({ 'LanguageName': 1 });
                }
            });
        }
    });
};

let languageUpdate = (req, res) => {
    Language.find({ LanguageName: req.body.LanguageName, _id: { $ne: req.body._id }, IsDelete: false }, function(err, data) {
        if (data.length) {
            response = { data: data, 'message' : constants.CONFLICT };
            res.send(response);
        }
        else {
            Language.update({ _id: req.body._id }, { $set: { LanguageName: req.body.LanguageName, IsActive: req.body.IsActive, IsDelete: req.body.IsDelete } },
                function(err) {
                    if(err) {
                        logger.error(err.message);
                    }
                    else {
                        Language.find({ IsDelete: false }, function(err, data) {
                            if(err) {
                                res.send(err);
                                logger.error(err.message);
                            }

                            var cacheKey = constants.LANGUAGE_CACHEKEY + req.body._id;
                            redisCache.set(cacheKey, data.filter(x=>x._id == req.body._id)[0], {ttl: 1}, function(err) {
                                if (err) {
                                    logger.error(err + '-' + constants.LANGUAGE_UPDATE);
                                    throw err;
                                }

                                redisCache.set(constants.LANGUAGEGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                                    if (err) {
                                        logger.error(err + '-' + constants.LANGUAGE_UPDATE);
                                        throw err;
                                    }

                                    redisCache.set(constants.LANGUAGEACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                        if (err) {
                                            logger.error(err + '-' + constants.LANGUAGE_UPDATE);
                                            throw err;
                                        }
                                    });
                                });
                            });

                            response = { data: data, 'message' : constants.OK };
                            res.json(response);
                        }).sort({ 'LanguageName': 1 });
                    }
                }
            );
        }
    });
};

let languageDelete = (req, res) => {
    var conflictStatus = 0;
    Candidate.find({ LanguageId: req.params.id }, function(err, result) {
        if (result.length) {
            conflictStatus = 1;
        }
        if (conflictStatus === 1) {
            response = { data: [], 'message' : constants.CONFLICT };
            res.json(response);
        }
        else {
            Language.update({ _id: req.params.id }, { $set: { IsDelete: true } },
                function(err) {
                    if(err) {
                        logger.error(err.message);
                    }
                    else {
                        Language.find({ IsDelete: false }, function(err, data) {
                            if(err) {
                                res.send(err);
                                logger.error(err.message);
                            }

                            redisCache.set(constants.LANGUAGEGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                                  if (err) {
                                      logger.error(err +  '-' + constants.LANGUAGE_DELETE);
                                      throw err;
                                  }

                                  redisCache.set(constants.LANGUAGEACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                      if (err) {
                                          logger.error(err + '-' + constants.LANGUAGE_DELETE);
                                          throw err;
                                      }
                                  });
                            });

                            response = { data: data, 'message' : constants.OK };
                            res.json(response);
                        }).sort({ 'LanguageName': 1 });
                    }
                }
            );
        }
    });
};

exports.languageGetAll = languageGetAll;
exports.languageGetById = languageGetById;
exports.languageActiveGetAll = languageActiveGetAll;
exports.languageInsert = languageInsert;
exports.languageUpdate = languageUpdate;
exports.languageDelete = languageDelete;