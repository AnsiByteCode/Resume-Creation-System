var User = require('./../Models/User.js');
var config = require('./../config');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
require('string.format');
var randomstring = require('randomstring');
let mailer = require('nodemailer');
var fs = require('fs');
var constants = require('./../Constants/Constants.js');

function createToken(user) {
    return jwt.sign(user, config.secret);
}

// Email details
var smtpTransport = mailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'gmail_username',
        pass: 'gmail_password'
    }
});

let loginDetails = (req, res) => {
    let user = req.body;
    var profile = _.pick(req.body, 'password');
    var id_token = createToken(profile);
    User.find({ Email: req.body.Email, Password: req.body.Password }, function(err, result) {
        if (result.length) {
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
                  Email: req.body.Email, IsActive: true, IsDelete: false
              }
            }
          ],
            function(err, data) {
                if(err) {
                    console.log(err.message);
                }
                if (data.length) {
                    response = { data: data, 'message' : constants.OK, id_token: id_token };
                    res.json(response);
                }
                else {
                    response = { data: data, 'message' : constants.INACTIVE, id_token: id_token };
                    res.json(response);
                }
            }
          );
        }
        else {
            if(err) {
                console.log(err.message);
            }

            response = { result: result, 'message' : constants.CONFLICT, id_token: id_token };
            res.json(response);
        }
    });
};

let forgotPassword = (req, res) => {
    var randomStringPassword = randomstring.generate(10);
    let user = req.body;
    User.find({ Email: req.body.Email, IsActive: true, IsDelete: false }, function(err, data) {
        if (data.length) {
            User.update({ Email: req.body.Email }, { $set: { Password: randomStringPassword } },
                function(err) {
                    if(err) {
                        console.log(err.message);
                    }
                    else {
                        var data = fs.readFileSync('ForgotPasswordEmailHTML.txt');
                        var params = {
                            Password : randomStringPassword
                        }

                        let mail = {
                            from: 'Hetal Mehta <test@gmail.com>',
                            to: user.Email,
                            subject: 'Resume Management System: Reset Password Request',
                            html: data.toString().format(params)
                        }

                        smtpTransport.sendMail(mail);
                        response = { 'message' : constants.OK };
                        res.json(response);
                    }
                }
            );
        }
        else {
            response = { 'message' : constants.CONFLICT };
            res.json(response);
        }

    });
};

let changePassword = (req, res) => {
    let user = req.body;
    User.find({ Email: req.body.Email, Password: req.body.OldPassword }, function(err, data) {
        if (data.length) {
            User.update({ Email: req.body.Email }, { $set: { Password: req.body.NewPassword } },
                function(err) {
                    if(err) {
                        console.log(err.message);
                    }
                    else {
                        response = { 'message' : constants.OK };
                        res.json(response);
                    }
                }
            );
        }
        else {
            response = { 'message' : constants.CONFLICT };
            res.json(response);
        }
    });
};

exports.loginDetails = loginDetails;
exports.forgotPassword = forgotPassword;
exports.changePassword = changePassword;