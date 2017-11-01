var express = require('express');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');
var config = require('./server/config');
var cors = require('cors');
var jwt = require('express-jwt');
var userAPI = require('./server/API/UserAPI.js');
var roleAPI = require('./server/API/RoleAPI.js');
var permissionModuleAPI = require('./server/API/PermissionModuleAPI.js');
var userPermissionAPI = require('./server/API/UserPermissionAPI.js');
var rolePermissionAPI = require('./server/API/RolePermissionAPI.js');
var userRoleAPI = require('./server/API/UserRoleAPI.js');
var loginAPI = require('./server/API/LoginAPI.js');
var applicationAPI = require('./server/API/ApplicationAPI.js');
var databaseAPI = require('./server/API/DatabaseAPI.js');
var designationAPI = require('./server/API/DesignationAPI.js');
var domainAPI = require('./server/API/DomainAPI.js');
var frameworkAPI = require('./server/API/FrameworkAPI.js');
var languageAPI = require('./server/API/LanguageAPI.js');
var operatingSystemAPI = require('./server/API/OperatingSystemAPI.js');
var projectAPI = require('./server/API/ProjectAPI.js');
var projectRoleAPI = require('./server/API/ProjectRoleAPI.js');
var technologyAPI = require('./server/API/TechnologyAPI.js');
var resumeAPI = require('./server/API/ResumeAPI.js');
var resumeCreationAPI = require('./server/API/ResumeCreationAPI.js');

// Database connection
mongoose.connect(config.databaseURL);

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.listen(8001, function(err) {
    if (err) {
      return console.error(err);
    }

    console.log('Listening at http://localhost:8001/');
});

//// API security
var jwtCheck = jwt({
    secret: config.secret
});

 app.use('/API', jwtCheck);

// User API
app.get('/API/UserGetAll', userAPI.userGetAll);
app.get('/API/UserGetById/:id', userAPI.userGetById);
app.get('/API/UserActiveGetAll', userAPI.userActiveGetAll);
app.post('/API/UserInsert', userAPI.userInsert);
app.put('/API/UserUpdate', userAPI.userUpdate);
app.delete('/API/UserDelete/:id', userAPI.userDelete);
app.get('/API/PermisssionsGetByEmail/:id', userAPI.permisssionsGetByEmail);

//// Role API
app.get('/API/RoleGetAll', roleAPI.roleGetAll);
app.get('/API/RoleGetById/:id', roleAPI.roleGetById);
app.get('/API/RoleActiveGetAll', roleAPI.roleActiveGetAll);
app.post('/API/RoleInsert', roleAPI.roleInsert);
app.put('/API/RoleUpdate', roleAPI.roleUpdate);
app.delete('/API/RoleDelete/:id', roleAPI.roleDelete);

//// Permission Module API
app.get('/API/PermissionModuleGetAll', permissionModuleAPI.permissionModuleGetAll);

//// User Permission API
app.get('/API/UserPermissionGetById/:id', userPermissionAPI.userPermissionGetById);
app.post('/API/UserPermissionInsert', userPermissionAPI.userPermissionInsert);

//// Role Permission API
app.get('/API/RolePermissionGetById/:id', rolePermissionAPI.rolePermissionGetById);
app.post('/API/RolePermissionInsert', rolePermissionAPI.rolePermissionInsert);

//// User Role API
app.get('/API/userRoleGetById/:id', userRoleAPI.userRoleGetById);
app.post('/API/UserRoleInsert', userRoleAPI.userRoleInsert);

// Login API
app.post('/LoginDetails', loginAPI.loginDetails);
app.post('/API/ChangePassword', loginAPI.changePassword);
app.post('/ForgotPassword', loginAPI.forgotPassword);

//// Application API
app.get('/API/ApplicationGetAll', applicationAPI.applicationGetAll);
app.get('/API/ApplicationGetById/:id', applicationAPI.applicationGetById);
app.get('/API/ApplicationActiveGetAll', applicationAPI.applicationActiveGetAll);
app.post('/API/ApplicationInsert', applicationAPI.applicationInsert);
app.put('/API/ApplicationUpdate', applicationAPI.applicationUpdate);
app.delete('/API/ApplicationDelete/:id', applicationAPI.applicationDelete);

//// Database API
app.get('/API/DatabaseGetAll', databaseAPI.databaseGetAll);
app.get('/API/DatabaseGetById/:id', databaseAPI.databaseGetById);
app.get('/API/DatabaseActiveGetAll', databaseAPI.databaseActiveGetAll);
app.post('/API/DatabaseInsert', databaseAPI.databaseInsert);
app.put('/API/DatabaseUpdate', databaseAPI.databaseUpdate);
app.delete('/API/DatabaseDelete/:id', databaseAPI.databaseDelete);

//// Resume download
app.get('/ResumeDownload/:name', resumeAPI.downloadResume);
app.post('/API/CreateResume',resumeCreationAPI.resumeCreation);

//// Designation API
app.get('/API/DesignationGetAll', designationAPI.designationGetAll);
app.get('/API/DesignationGetById/:id', designationAPI.designationGetById);
app.get('/API/DesignationActiveGetAll', designationAPI.designationActiveGetAll);
app.post('/API/DesignationInsert', designationAPI.designationInsert);
app.put('/API/DesignationUpdate', designationAPI.designationUpdate);
app.delete('/API/DesignationDelete/:id', designationAPI.designationDelete);

//// Domain API
app.get('/API/DomainGetAll', domainAPI.domainGetAll);
app.get('/API/DomainGetById/:id', domainAPI.domainGetById);
app.get('/API/DomainActiveGetAll', domainAPI.domainActiveGetAll);
app.post('/API/DomainInsert', domainAPI.domainInsert);
app.put('/API/DomainUpdate', domainAPI.domainUpdate);
app.delete('/API/DomainDelete/:id', domainAPI.domainDelete);

//// Framework API
app.get('/API/FrameworkGetAll', frameworkAPI.frameworkGetAll);
app.get('/API/FrameworkGetById/:id', frameworkAPI.frameworkGetById);
app.get('/API/FrameworkActiveGetAll', frameworkAPI.frameworkActiveGetAll);
app.post('/API/FrameworkInsert', frameworkAPI.frameworkInsert);
app.put('/API/FrameworkUpdate', frameworkAPI.frameworkUpdate);
app.delete('/API/FrameworkDelete/:id', frameworkAPI.frameworkDelete);

//// Language API
app.get('/API/LanguageGetAll', languageAPI.languageGetAll);
app.get('/API/LanguageGetById/:id', languageAPI.languageGetById);
app.get('/API/LanguageActiveGetAll', languageAPI.languageActiveGetAll);
app.post('/API/LanguageInsert', languageAPI.languageInsert);
app.put('/API/LanguageUpdate', languageAPI.languageUpdate);
app.delete('/API/LanguageDelete/:id', languageAPI.languageDelete);

//// Operating System API
app.get('/API/OperatingSystemGetAll', operatingSystemAPI.operatingSystemGetAll);
app.get('/API/OperatingSystemGetById/:id', operatingSystemAPI.operatingSystemGetById);
app.get('/API/OperatingSystemActiveGetAll', operatingSystemAPI.operatingSystemActiveGetAll);
app.post('/API/OperatingSystemInsert', operatingSystemAPI.operatingSystemInsert);
app.put('/API/OperatingSystemUpdate', operatingSystemAPI.operatingSystemUpdate);
app.delete('/API/OperatingSystemDelete/:id', operatingSystemAPI.operatingSystemDelete);

//// Project API
app.get('/API/ProjectGetAll', projectAPI.projectGetAll);
app.get('/API/ProjectGetById/:id', projectAPI.projectGetById);
app.get('/API/ProjectActiveGetAll', projectAPI.projectActiveGetAll);
app.post('/API/ProjectInsert', projectAPI.projectInsert);
app.put('/API/ProjectUpdate', projectAPI.projectUpdate);
app.delete('/API/ProjectDelete/:id', projectAPI.projectDelete);

//// Project Role API
app.get('/API/ProjectRoleGetAll', projectRoleAPI.projectRoleGetAll);
app.get('/API/ProjectRoleGetById/:id', projectRoleAPI.projectRoleGetById);
app.get('/API/ProjectRoleActiveGetAll', projectRoleAPI.projectRoleActiveGetAll);
app.post('/API/ProjectRoleInsert', projectRoleAPI.projectRoleInsert);
app.put('/API/ProjectRoleUpdate', projectRoleAPI.projectRoleUpdate);
app.delete('/API/ProjectRoleDelete/:id', projectRoleAPI.projectRoleDelete);

//// Technology API
app.get('/API/TechnologyGetAll', technologyAPI.technologyGetAll);
app.get('/API/TechnologyGetById/:id', technologyAPI.technologyGetById);
app.get('/API/TechnologyActiveGetAll', technologyAPI.technologyActiveGetAll);
app.post('/API/TechnologyInsert', technologyAPI.technologyInsert);
app.put('/API/TechnologyUpdate', technologyAPI.technologyUpdate);
app.delete('/API/TechnologyDelete/:id', technologyAPI.technologyDelete);

//// Resume API
app.get('/API/ResumeGetAll', resumeAPI.resumeGetAll);
app.get('/API/ResumeGetById/:id', resumeAPI.resumeGetById);
app.get('/API/ResumeGetAllDetailsById/:id', resumeAPI.resumeGetAllDetailsById);
app.post('/API/ResumeInsert', resumeAPI.resumeInsert);
app.put('/API/ResumeUpdate', resumeAPI.resumeUpdate);
app.delete('/API/ResumeDelete/:id', resumeAPI.resumeDelete);