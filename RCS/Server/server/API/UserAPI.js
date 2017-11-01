var User = require('./../Models/User.js');
var constants = require('./../Constants/Constants.js');
var commonFunctions = require('./../Common/CommonFunctions.js');
var redisCache = require('./../public/Cache.js');
/* log4js*/
var log4js = require('log4js');
log4js.configure('./log4js.json');
var logger = log4js.getLogger('rms-appender');

let userGetAll = (req, res) => {
    redisCache.wrap(constants.USERGETALL_CACHEKEY, function (cacheCb) {
      User.aggregate([{ $project:{ FirstName: '$FirstName', LastName: '$LastName', FullName:{ $concat:['$FirstName', ' ', '$LastName'] },
                      ContactNumber: '$ContactNumber', Email: '$Email', Password: '$Password', IsActive: '$IsActive', IsDelete: '$IsDelete' } },
                      { $sort: { 'FullName': 1 }}, { $match: { 'IsDelete': false } }], cacheCb);
    }, commonFunctions.responder(res));
};

let userGetById = (req, res) => {
    let id = req.params.id;
    var cacheKey = constants.USER_CACHEKEY + id;
    redisCache.wrap(cacheKey, function (cacheCb) {
        User.findOne({ _id: id }, cacheCb);
    }, commonFunctions.responder(res));
};

let userActiveGetAll = (req, res) => {
  redisCache.wrap(constants.USERACTIVEGETALL_CACHEKEY, function (cacheCb) {
    User.find({ IsActive: true, IsDelete: false }, cacheCb).sort({ 'Email': 1 });
  }, commonFunctions.responder(res));
};

let userInsert = (req, res) => {
    var userSchema = new User({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        ContactNumber: req.body.ContactNumber,
        Email: req.body.Email,
        Password: req.body.Password,
        IsActive: req.body.IsActive,
        IsDelete: false
    });

    User.find({ Email: req.body.Email, IsDelete: false }, function(err, data) {
        if (data.length) {
            response = { data: data, 'message' : constants.CONFLICT };
            res.send(response);
        }
        else {
            userSchema.save(function(err) {
                if(err) {
                    logger.error(err.message);
                }
                else {
                    User.aggregate([{ $project:{ FirstName: '$FirstName', LastName: '$LastName', FullName:{ $concat:['$FirstName', ' ', '$LastName'] },
                        ContactNumber: '$ContactNumber', Email: '$Email', Password: '$Password', IsActive: '$IsActive', IsDelete: '$IsDelete' } },
                    { $sort: { 'FullName': 1 }}, { $match: { 'IsDelete': false } }], function(err, data) {
                        if(err) {
                            res.send(err);
                            logger.error(err.message);
                        }

                        redisCache.set(constants.USERGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                              if (err) {
                                  logger.error(err + '-' + constants.USER_INSERT);
                                  throw err;
                              }
                        });

                        response = { data: data, 'message' : constants.OK };
                        res.json(response);
                    });
                }
            });
        }
    });
};

let userUpdate = (req, res) => {
    User.find({ Email: req.body.Email, _id:{ $ne: req.body._id }, IsDelete: false }, function(err, data) {
        if (data.length) {
            response = { data: data, 'message' : constants.CONFLICT };
            res.send(response);
        }
        else {
            User.update({ _id: req.body._id }, { $set: { FirstName: req.body.FirstName, LastName: req.body.LastName, ContactNumber: req.body.ContactNumber, IsActive: req.body.IsActive, IsDelete: req.body.IsDelete } },
                function(err) {
                    if(err) {
                        logger.error(err.message);
                    }
                    else {
                        User.aggregate([{ $project:{ FirstName: '$FirstName', LastName: '$LastName', FullName:{ $concat:['$FirstName', ' ', '$LastName'] },
                            ContactNumber: '$ContactNumber', Email: '$Email', Password: '$Password', IsActive: '$IsActive', IsDelete: '$IsDelete' } },
                            { $sort: { 'FullName': 1 } }, { $match: { 'IsDelete': false } }], function(err, data) {
                            if(err) {
                                res.send(err);
                                logger.error(err.message);
                            }

                            var cacheKey = constants.USER_CACHEKEY + req.body._id;
                            redisCache.set(cacheKey, data.filter(x=>x._id == req.body._id)[0], {ttl: 1}, function(err) {
                                if (err) {
                                    logger.error(err + '-' + constants.USER_UPDATE);
                                    throw err;
                                }

                                redisCache.set(constants.USERGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                                    if (err) {
                                        logger.error(err + '-' + constants.USER_UPDATE);
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

let userDelete = (req, res) => {
    User.update({ _id: req.params.id }, { $set: { IsDelete: true } },
        function(err) {
            if(err) {
                logger.error(err.message);
            }
            else {
                User.aggregate([{ $project:{ FirstName: '$FirstName', LastName: '$LastName', FullName:{$concat:['$FirstName', ' ', '$LastName'] },
                                ContactNumber: '$ContactNumber', Email: '$Email', Password: '$Password', IsActive: '$IsActive', IsDelete: '$IsDelete' } },
                                { $sort: { 'FullName': 1 } }, { $match: { 'IsDelete': false } }], function(err, data) {
                    if(err) {
                        res.send(err);
                        logger.error(err.message);
                    }

                    redisCache.set(constants.USERGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                          if (err) {
                              logger.error(err +  '-' + constants.USER_DELETE);
                              throw err;
                          }
                    });

                    response = { data: data, 'message' : constants.OK };
                    res.json(response);
                });
            }
        }
    );
};

let permisssionsGetByEmail = (req, res) => {
  User.aggregate([
    {
      $lookup: {
        from: 'userpermissions',
        localField: '_id',
        foreignField: 'UserId',
        as: 'userpermissions'
      }
    },
    {
      $lookup:
      {
        from: 'userroles',
        localField: '_id',
        foreignField: 'UserId',
        as: 'userroles'
      }
    },
    {
      $unwind:'$userroles'
    },
    {
      $lookup: {
        from: 'rolepermissions',
        localField: 'userroles.RoleId',
        foreignField: 'RoleId',
        as: 'rolepermissions'
      }
    },
    {
      $project:
      {
        'FirstName': '$FirstName',
        'LastName': '$LastName',
        'FullName': { $concat:['$FirstName', ' ', '$LastName'] },
        'ContactNumber': '$ContactNumber',
        'Email': '$Email',
        'Password': '$Password',
        'IsActive': '$IsActive',
        'IsDelete': '$IsDelete',
        'userpermissions': '$userpermissions',
        'userroles': '$userroles',
        'rolepermissions': '$rolepermissions'
      }
    },
    {
      $match:
      {
          Email: req.params.id
      }
    }
  ],
  function(err, data) {
      if(err) {
          console.log(err.message);
      }
      if (data.length) {
          res.json(data);
      }
    }
  );
};

exports.userGetAll = userGetAll;
exports.userGetById = userGetById;
exports.userActiveGetAll = userActiveGetAll;
exports.userInsert = userInsert;
exports.userUpdate = userUpdate;
exports.userDelete = userDelete;
exports.permisssionsGetByEmail = permisssionsGetByEmail;