var Role = require('./../Models/Role.js');
var UserRole = require('./../Models/UserRole.js');
var constants = require('./../Constants/Constants.js');
var commonFunctions = require('./../Common/CommonFunctions.js');
var redisCache = require('./../public/Cache.js');
/* log4js*/
var log4js = require('log4js');
log4js.configure('./log4js.json');
var logger = log4js.getLogger('rms-appender');

let roleGetAll = (req, res) => {
  redisCache.wrap(constants.ROLEGETALL_CACHEKEY, function (cacheCb) {
    Role.find({ IsDelete: false }, cacheCb).sort({ 'RoleName': 1 });
  }, commonFunctions.responder(res));
};

let roleGetById = (req, res) => {
  let id = req.params.id;
  var cacheKey = constants.ROLE_CACHEKEY + id;
  redisCache.wrap(cacheKey, function (cacheCb) {
    Role.findOne({ _id: id }, cacheCb);
  }, commonFunctions.responder(res));
};

let roleActiveGetAll = (req, res) => {
  redisCache.wrap(constants.ROLEACTIVEGETALL_CACHEKEY, function (cacheCb) {
    Role.find({ IsActive: true, IsDelete: false }, cacheCb).sort({ 'RoleName': 1 });
  }, commonFunctions.responder(res));
};

let roleInsert = (req, res) => {
  var roleSchema = new Role({
    RoleName: req.body.RoleName,
    IsActive: req.body.IsActive,
    IsDelete: false
  });

  Role.find({ RoleName: req.body.RoleName, _id: { $ne: req.body._id }, IsDelete: false }, function(err, data) {
    if (data.length) {
      response = { data: data, 'message' : constants.CONFLICT };
      res.send(response);
    }
    else {
      roleSchema.save(function(err) {
        if(err) {
          logger.error(err.message);
        }
        else {
          Role.find({ IsDelete: false }, function(err, data) {
            if(err) {
              res.send(err);
              logger.error(err.message);
            }

            redisCache.set(constants.ROLEGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                if (err) {
                  logger.error(err + '-' + constants.ROLE_INSERT);
                  throw err;
                }

                redisCache.set(constants.ROLEACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                  if (err) {
                    logger.error(err +  '-' + constants.ROLE_INSERT);
                    throw err;
                  }
                });
            });

            response = { data: data, 'message' : constants.OK };
            res.json(response);
          }).sort({ 'RoleName': 1 });
        }
      });
    }
  });
};

let roleUpdate = (req, res) => {
  Role.find({ RoleName: req.body.RoleName, _id: { $ne: req.body._id }, IsDelete: false }, function(err, data) {
    if (data.length) {
      response = { data: data, 'message' : constants.CONFLICT };
      res.send(response);
    }
    else {
      Role.update({ _id: req.body._id }, { $set: { RoleName: req.body.RoleName, IsActive: req.body.IsActive, IsDelete: req.body.IsDelete } },
        function(err) {
          if(err) {
            logger.error(err.message);
          }
          else {
            Role.find({ IsDelete: false }, function(err, data) {
              if(err) {
                res.send(err);
                logger.error(err.message);
              }

              var cacheKey = constants.ROLE_CACHEKEY + req.body._id;
              redisCache.set(cacheKey, data.filter(x=>x._id == req.body._id)[0], {ttl: 1}, function(err) {
                if (err) {
                  logger.error(err + '-' + constants.ROLE_UPDATE);
                  throw err;
                }

                redisCache.set(constants.ROLEGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                    if (err) {
                      logger.error(err + '-' + constants.ROLE_UPDATE);
                      throw err;
                    }

                    redisCache.set(constants.ROLEACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                      if (err) {
                        logger.error(err + '-' + constants.ROLE_UPDATE);
                        throw err;
                      }
                    });
                  });
                });

                response = { data: data, 'message' : constants.OK };
                res.json(response);
            }).sort({ 'RoleName': 1 });
          }
        }
      );
    }
  });
};

let roleDelete = (req, res) => {
  var conflictStatus = 0;
  UserRole.find({ RoleId: req.params.id }, function(err, result) {
    if (result.length) {
        conflictStatus = 1;
    }
    if (conflictStatus === 1) {
        response = { data: [], 'message' : constants.CONFLICT };
        res.json(response);
    }
    else {
      Role.update({ _id: req.params.id }, { $set: { IsDelete: true } },
        function(err) {
          if(err) {
            logger.error(err.message);
          }
          else {
            Role.find({ IsDelete: false }, function(err, data) {
                if(err) {
                  res.send(err);
                  logger.error(err.message);
                }

                redisCache.set(constants.ROLEGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                  if (err) {
                    logger.error(err +  '-' + constants.ROLE_DELETE);
                    throw err;
                  }

                  redisCache.set(constants.ROLEACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                    if (err) {
                      logger.error(err + '-' + constants.ROLE_DELETE);
                      throw err;
                    }
                  });
                });

                response = { data: data, 'message' : constants.OK };
                res.json(response);
            }).sort({ 'RoleName': 1 });
          }
        }
      );
    }
  });
};

exports.roleGetAll = roleGetAll;
exports.roleGetById = roleGetById;
exports.roleActiveGetAll = roleActiveGetAll;
exports.roleInsert = roleInsert;
exports.roleUpdate = roleUpdate;
exports.roleDelete = roleDelete;