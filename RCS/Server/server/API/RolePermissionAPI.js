var RolePermission = require('./../Models/RolePermission.js');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var constants = require('./../Constants/Constants.js');
var commonFunctions = require('./../Common/CommonFunctions.js');
var redisCache = require('./../public/Cache.js');
/* log4js*/
var log4js = require('log4js');
log4js.configure('./log4js.json');
var logger = log4js.getLogger('rms-appender');

let rolePermissionGetById = (req, res) => {
  let id = req.params.id;
  RolePermission.find({ RoleId: id }, function(err, data){
    if(err) {
      res.send(err);
      logger.error(err.message);
    }
    else {
      res.json(data);
    }
  });
};

let rolePermissionInsert = (req, res) => {
  RolePermission.find({ RoleId: req.body.RoleId }, function(err, data) {
    if(data.length) {
      RolePermission.remove({ RoleId: req.body.RoleId }, function() {
        for(var index = 0 ; index < req.body.ModuleList.length; index++) {
          var rolePermissionSchema = new RolePermission({
            RoleId: ObjectId(req.body.RoleId),
            PermissionModuleId: ObjectId(req.body.ModuleList[index].PermissionModuleId),
            ModuleKey: req.body.ModuleList[index].ModuleKey
          });

          rolePermissionSchema.save(function(err) {
            if(err) {
              logger.error(err.message);
            }
          });
        }

        RolePermission.find(function(err, data) {
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
        var rolePermissionSchema = new RolePermission({
          RoleId: ObjectId(req.body.RoleId),
          PermissionModuleId: ObjectId(req.body.ModuleList[index].PermissionModuleId),
          ModuleKey: req.body.ModuleList[index].ModuleKey
        });

        rolePermissionSchema.save(function(err) {
          if(err) {
            logger.error(err.message);
          }
        });
      }

      RolePermission.find(function(err, data) {
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

exports.rolePermissionGetById = rolePermissionGetById;
exports.rolePermissionInsert = rolePermissionInsert;