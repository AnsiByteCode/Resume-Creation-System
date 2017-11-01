/* log4js*/
var log4js = require('log4js');
log4js.configure('./log4js.json');
var logger = log4js.getLogger('rms-appender');

var responder = (res) => {
    return function respond(err, data) {
        if (err) {
            err.status = 500;
            res.json('error', {error: err});
            logger.error(err.message);
        } else {
            logger.debug('Get data from ' + res.req.url);
            res.json(data);
        }
    };
};

exports.responder = responder;