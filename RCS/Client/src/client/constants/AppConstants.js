var BASE_URL = 'http://192.168.1.241:8001/API/';
var BASE_API_URL = 'http://192.168.1.241:8001/';

var appConstants = {
    BASE_URL: BASE_URL,

    //// User
    USER_GETALL: `${BASE_URL}UserGetAll`,
    USER_GETBYID: `${BASE_URL}UserGetById/`,
    USER_ACTIVEGETALL: `${BASE_URL}UserActiveGetAll`,
    USER_INSERT: `${BASE_URL}UserInsert`,
    USER_UPDATE: `${BASE_URL}UserUpdate`,
    USER_DELETE: `${BASE_URL}UserDelete/`,
    PERMISSIONS_GETBYID: `${BASE_URL}PermisssionsGetByEmail/`,

    //// Role
    ROLE_GETALL: `${BASE_URL}RoleGetAll`,
    ROLE_GETBYID: `${BASE_URL}RoleGetById/`,
    ROLE_ACTIVEGETALL: `${BASE_URL}RoleActiveGetAll`,
    ROLE_INSERT: `${BASE_URL}RoleInsert`,
    ROLE_UPDATE: `${BASE_URL}RoleUpdate`,
    ROLE_DELETE: `${BASE_URL}RoleDelete/`,

    //// Permission Module
    PERMISSIONMODULE_GETALL: `${BASE_URL}PermissionModuleGetAll`,

    //// User Permission
    USERPERMISSION_GETBYID: `${BASE_URL}UserPermissionGetById/`,
    USERPERMISSION_INSERT: `${BASE_URL}UserPermissionInsert`,

    //// Role Permission
    ROLEPERMISSION_GETBYID: `${BASE_URL}RolePermissionGetById/`,
    ROLEPERMISSION_INSERT: `${BASE_URL}RolePermissionInsert`,

    //// User Role/Assign Role
    USERROLE_GETBYID: `${BASE_URL}UserRoleGetById/`,
    USERROLE_INSERT: `${BASE_URL}UserRoleInsert`,

    //// Login
    AUTH_TOKEN: 'Bearer ',
    LOGIN_DETAILS: `${BASE_API_URL}LoginDetails`,
    CHANGE_PASSWORD: `${BASE_URL}ChangePassword`,
    FORGOT_PASSWORD: `${BASE_API_URL}ForgotPassword`,

    //// Application
    APPLICATION_GETALL: `${BASE_URL}ApplicationGetAll`,
    APPLICATION_GETBYID: `${BASE_URL}ApplicationGetById/`,
    APPLICATION_ACTIVEGETALL: `${BASE_URL}ApplicationActiveGetAll`,
    APPLICATION_INSERT: `${BASE_URL}ApplicationInsert`,
    APPLICATION_UPDATE: `${BASE_URL}ApplicationUpdate`,
    APPLICATION_DELETE: `${BASE_URL}ApplicationDelete/`,

    //// Database
    DATABASE_GETALL: `${BASE_URL}DatabaseGetAll`,
    DATABASE_GETBYID: `${BASE_URL}DatabaseGetById/`,
    DATABASE_ACTIVEGETALL: `${BASE_URL}DatabaseActiveGetAll`,
    DATABASE_INSERT: `${BASE_URL}DatabaseInsert`,
    DATABASE_UPDATE: `${BASE_URL}DatabaseUpdate`,
    DATABASE_DELETE: `${BASE_URL}DatabaseDelete/`,

    //// Resume Download
    RESUMEDOWNLOAD : `${BASE_API_URL}ResumeDownload`,
    RESUMECREATION : `${BASE_URL}CreateResume`,

    //// Designation
    DESIGNATION_GETALL: `${BASE_URL}DesignationGetAll`,
    DESIGNATION_GETBYID: `${BASE_URL}DesignationGetById/`,
    DESIGNATION_ACTIVEGETALL: `${BASE_URL}DesignationActiveGetAll`,
    DESIGNATION_INSERT: `${BASE_URL}DesignationInsert`,
    DESIGNATION_UPDATE: `${BASE_URL}DesignationUpdate`,
    DESIGNATION_DELETE: `${BASE_URL}DesignationDelete/`,

    //// Domain
    DOMAIN_GETALL: `${BASE_URL}DomainGetAll`,
    DOMAIN_GETBYID: `${BASE_URL}DomainGetById/`,
    DOMAIN_ACTIVEGETALL: `${BASE_URL}DomainActiveGetAll`,
    DOMAIN_INSERT: `${BASE_URL}DomainInsert`,
    DOMAIN_UPDATE: `${BASE_URL}DomainUpdate`,
    DOMAIN_DELETE: `${BASE_URL}DomainDelete/`,

    //// Framework
    FRAMEWORK_GETALL: `${BASE_URL}FrameworkGetAll`,
    FRAMEWORK_GETBYID: `${BASE_URL}FrameworkGetById/`,
    FRAMEWORK_ACTIVEGETALL: `${BASE_URL}FrameworkActiveGetAll`,
    FRAMEWORK_INSERT: `${BASE_URL}FrameworkInsert`,
    FRAMEWORK_UPDATE: `${BASE_URL}FrameworkUpdate`,
    FRAMEWORK_DELETE: `${BASE_URL}FrameworkDelete/`,

    //// Language
    LANGUAGE_GETALL: `${BASE_URL}LanguageGetAll`,
    LANGUAGE_GETBYID: `${BASE_URL}LanguageGetById/`,
    LANGUAGE_ACTIVEGETALL: `${BASE_URL}LanguageActiveGetAll`,
    LANGUAGE_INSERT: `${BASE_URL}LanguageInsert`,
    LANGUAGE_UPDATE: `${BASE_URL}LanguageUpdate`,
    LANGUAGE_DELETE: `${BASE_URL}LanguageDelete/`,

    //// Operating System
    OPERATINGSYSTEM_GETALL: `${BASE_URL}OperatingSystemGetAll`,
    OPERATINGSYSTEM_GETBYID: `${BASE_URL}OperatingSystemGetById/`,
    OPERATINGSYSTEM_ACTIVEGETALL: `${BASE_URL}OperatingSystemActiveGetAll`,
    OPERATINGSYSTEM_INSERT: `${BASE_URL}OperatingSystemInsert`,
    OPERATINGSYSTEM_UPDATE: `${BASE_URL}OperatingSystemUpdate`,
    OPERATINGSYSTEM_DELETE: `${BASE_URL}OperatingSystemDelete/`,

    //// Project
    PROJECT_GETALL: `${BASE_URL}ProjectGetAll`,
    PROJECT_GETBYID: `${BASE_URL}ProjectGetById/`,
    PROJECT_ACTIVEGETALL: `${BASE_URL}ProjectActiveGetAll`,
    PROJECT_INSERT: `${BASE_URL}ProjectInsert`,
    PROJECT_UPDATE: `${BASE_URL}ProjectUpdate`,
    PROJECT_DELETE: `${BASE_URL}ProjectDelete/`,

    //// Project Role
    PROJECTROLE_GETALL: `${BASE_URL}ProjectRoleGetAll`,
    PROJECTROLE_GETBYID: `${BASE_URL}ProjectRoleGetById/`,
    PROJECTROLE_ACTIVEGETALL: `${BASE_URL}ProjectRoleActiveGetAll`,
    PROJECTROLE_INSERT: `${BASE_URL}ProjectRoleInsert`,
    PROJECTROLE_UPDATE: `${BASE_URL}ProjectRoleUpdate`,
    PROJECTROLE_DELETE: `${BASE_URL}ProjectRoleDelete/`,

    //// Technology
    TECHNOLOGY_GETALL: `${BASE_URL}TechnologyGetAll`,
    TECHNOLOGY_GETBYID: `${BASE_URL}TechnologyGetById/`,
    TECHNOLOGY_ACTIVEGETALL: `${BASE_URL}TechnologyActiveGetAll`,
    TECHNOLOGY_INSERT: `${BASE_URL}TechnologyInsert`,
    TECHNOLOGY_UPDATE: `${BASE_URL}TechnologyUpdate`,
    TECHNOLOGY_DELETE: `${BASE_URL}TechnologyDelete/`,

    //// CANDIDATE
    CANDIDATE_NAME : 'Candidate Name',
    EDUCATION_DESCRIPTION : 'Education Description',
    CURRENT_COMPANY_NAME : 'Current Company Name',
    CURRENT_DESIGNATION : 'Current Designation',
    EXPERIENCE :  'Experience',
    TEAM_SIZE : 'Team Size',
    PROJECT_COUNT : 'Project Count',
    KNOWLEDGE_DESCRIPTION : 'Knowledge Description',
    WORK_DESCRIPTION : 'Work Description',
    DOMAIN : 'Domain',
    APPLICATION : 'Application',
    OS : 'Operation System',
    TECHNOLOGY : 'Technology',
    FRAMEWORK : 'Framework',
    LANGUAGE : 'Language',
    DATABASE : 'Database',
    ROLES_AND_RESPONSIBILITY : 'Roles and Responsibilities',
    ROLES : 'Roles',
    ROLE : 'Role',
    RESPONSIBILITIES : 'Responsibilities',
    PROJECT : 'Project',
    PROJECTS : 'Projectds',

    //// Resume
    RESUME_GETALL: `${BASE_URL}ResumeGetAll`,
    RESUME_GETBYID: `${BASE_URL}ResumeGetById/`,
    RESUME_GETALLDETAILSBYID : `${BASE_URL}ResumeGetAllDetailsById/`,
    RESUME_INSERT: `${BASE_URL}ResumeInsert`,
    RESUME_UPDATE: `${BASE_URL}ResumeUpdate`,
    RESUME_DELETE: `${BASE_URL}ResumeDelete/`
};

module.exports = appConstants;