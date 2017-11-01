var UserRole = require('./../Models/UserRole.js');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var constants = require('./../Constants/Constants.js');
var commonFunctions = require('./../Common/CommonFunctions.js');
var redisCache = require('./../public/Cache.js');
/* log4js*/
var log4js = require('log4js');
log4js.configure('./log4js.json');
var logger = log4js.getLogger('rms-appender');

let userRoleGetById = (req, res) => {
  let id = req.params.id;
  UserRole.find({ UserId: ObjectId(id) }, function(err, data) {
    if(err) {
      res.send(err);
      logger.error(err.message);
    }
    else {
      res.json(data);
    }
  });
};

let userRoleInsert = (req, res) => {
  UserRole.find({ UserId: req.body.UserId }, function(err, data) {
    if(data.length) {
      UserRole.remove({ UserId: req.body.UserId }, function() {
          var userRoleSchema = new UserRole({
            UserId: ObjectId(req.body.UserId),
            RoleId: ObjectId(req.body.RoleId)
          });

          userRoleSchema.save(function(err) {
            if(err) {
              logger.error(err.message);
            }
          });

        UserRole.find(function(err, data) {
          if(err) {
            res.send(err);
            logger.error(err.message);
          }

          response = { data: data, 'message' : constants.OK };
          res.json(response);
        });
      });
    }
    else {
        var userRoleSchema = new UserRole({
          UserId: ObjectId(req.body.UserId),
          RoleId: ObjectId(req.body.RoleId)
        });

        userRoleSchema.save(function(err) {
          if(err) {
            logger.error(err.message);
          }
        });

      UserRole.find(function(err, data) {
        if(err) {
          res.send(err);
          logger.error(err.message);
        }

        response = { data: data, 'message' : constants.OK };
        res.json(response);
      });
    }
  });
};

exports.userRoleGetById = userRoleGetById;
exports.userRoleInsert = userRoleInsert;