var PermissionModule = require('./../Models/PermissionModule.js');
var constants = require('./../Constants/Constants.js');
var commonFunctions = require('./../Common/CommonFunctions.js');
var redisCache = require('./../public/Cache.js');
/* log4js*/
var log4js = require('log4js');
log4js.configure('./log4js.json');
var logger = log4js.getLogger('rms-appender');

let permissionModuleGetAll = (req, res) => {
  redisCache.wrap(constants.PERMISSIONMODULEGETALL_CACHEKEY, function (cacheCb) {
    PermissionModule.find({ IsActive: true }, cacheCb).sort({ 'DisplayName': 1 });
  }, commonFunctions.responder(res));
};

exports.permissionModuleGetAll = permissionModuleGetAll;