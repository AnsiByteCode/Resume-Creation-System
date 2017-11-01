var UserPermission = require('./../Models/UserPermission.js');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var constants = require('./../Constants/Constants.js');
var commonFunctions = require('./../Common/CommonFunctions.js');
var redisCache = require('./../public/Cache.js');
/* log4js*/
var log4js = require('log4js');
log4js.configure('./log4js.json');
var logger = log4js.getLogger('rms-appender');

let userPermissionGetById = (req, res) => {
  let id = req.params.id;
  UserPermission.find({ UserId: id }, function(err, data){
    if(err) {
      res.send(err);
      logger.error(err.message);
    }
    else {
      res.json(data);
    }
  });
};

let userPermissionInsert = (req, res) => {
  UserPermission.find({ UserId: req.body.UserId }, function(err, data) {
    if(data.length) {
      UserPermission.remove({ UserId: req.body.UserId }, function() {
        for(var index = 0 ; index < req.body.ModuleList.length; index++) {
          var userPermissionSchema = new UserPermission({
            UserId: ObjectId(req.body.UserId),
            PermissionModuleId: ObjectId(req.body.ModuleList[index].PermissionModuleId),
            ModuleKey: req.body.ModuleList[index].ModuleKey
          });

          userPermissionSchema.save(function(err) {
            if(err) {
              logger.error(err.message);
            }
          });
        }

        UserPermission.find(function(err, data) {
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
      for(var index = 0 ; index < req.body.ModuleList.length; index++) {
        var userPermissionSchema = new UserPermission({
          UserId: ObjectId(req.body.UserId),
          PermissionModuleId: ObjectId(req.body.ModuleList[index].PermissionModuleId),
          ModuleKey: req.body.ModuleList[index].ModuleKey
        });

        userPermissionSchema.save(function(err) {
          if(err) {
            logger.error(err.message);
          }
        });
      }
      UserPermission.find(function(err, data) {
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

exports.userPermissionGetById = userPermissionGetById;
exports.userPermissionInsert = userPermissionInsert;