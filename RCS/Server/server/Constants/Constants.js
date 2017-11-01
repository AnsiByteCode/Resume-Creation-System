var Constants = {
    DATABASE_URL: 'mongodb://192.168.1.220:27017/ResumeCreationSystem',
    SECRET_VALUE: 'ABC',
    BRIEF_OVERVIEW : 'Brief Overview',
    CANDIDATE_TEAM_SIZE : 'Worked with Team Size of ',
    IN_MULTIPLE_PROJECTS : '+ and multiple projects.',
    OVER : 'Over ',
    EXPERIENCE : '+ years of experience in Software Development.',
    RICH_EXPERIENCE : 'Rich experience in ',
    APPLICATIONS : ' applications.',
    DOMAIN_EXPERTIES : 'Domain expertise in ',
    PROJECT_EXPERIENCE : 'Project Experience',
    TECHNOLOGIES : 'Technologies: ',
    OPERATING_SYSTEMS : 'Operating Systems: ',
    DOMAINS : 'Domain: ',
    DATABASES : 'Database: ',
    PROJECT_DESCRIPTION : 'Project Description: ',
    // ROLES_RESPONSIBILITIES_PROJECT : 'Role and Responsibility in project : ',
    ROLES_RESPONSIBILITIES_PROJECT : 'Role and Responsibility: ',
    WORK_AS_A : 'Work as a ',
    EDU_CER_TRA : 'Education/Certifications/Trainings',
    DOCS_EXTENTION : '.docx',
    ANSIBYTECODELLP : 'Ansi ByteCode LLP.',
    ADDRESS1 : 'D-203, 2nd Floor, Ganesh Meridian, Besides Audi Showroom,',
    ADDRESS2 : 'Opp. Gujarat High Court, S.G.Highway, Ahmedabad -54',
    RESPONSIBILITIES : 'Responsibilities:',
    WORK_EXPERIENCE : 'Work Experience',
    SKILL_SET : 'Skill set',
    OS : 'OS',
    WEB_TECHNOLOGIES : 'Web Technologies',
    LANG_TOOLS :'Languages and Tools',
    FRAMEWORK : 'Frameworks',
    DATABASES_TABLE : 'Databases',
    UPLOADS: '/../uploads/',
    OK: 'Ok',
    CONFLICT: 'Conflict',
    INACTIVE: "Inactive",

    //// Application
    APPLICATIONGETALL_CACHEKEY : 'ApplicationGetAll_CacheKey',
    APPLICATION_CACHEKEY : 'Application_',
    APPLICATIONACTIVEGETALL_CACHEKEY : 'ApplicationActiveGetAll_CacheKey',
    APPLICATION_INSERT : 'Application Insert',
    APPLICATION_UPDATE : 'Application Update',
    APPLICATION_DELETE : 'Application Delete',

    //// Database
    DATABASEGETALL_CACHEKEY : 'DatabaseGetAll_CacheKey',
    DATABASE_CACHEKEY : 'Database_',
    DATABASEACTIVEGETALL_CACHEKEY : 'DatabaseActiveGetAll_CacheKey',
    DATABASE_INSERT : 'Database Insert',
    DATABASE_UPDATE : 'Database Update',
    DATABASE_DELETE : 'Database Delete',

    //// Designation
    DESIGNATIONGETALL_CACHEKEY : 'DesignationGetAll_CacheKey',
    DESIGNATION_CACHEKEY : 'Designation_',
    DESIGNATIONACTIVEGETALL_CACHEKEY : 'DesignationActiveGetAll_CacheKey',
    DESIGNATION_INSERT : 'Designation Insert',
    DESIGNATION_UPDATE : 'Designation Update',
    DESIGNATION_DELETE : 'Designation Delete',

    //// Domain
    DOMAINGETALL_CACHEKEY : 'DomainGetAll_CacheKey',
    DOMAIN_CACHEKEY : 'Domain_',
    DOMAINACTIVEGETALL_CACHEKEY : 'DomainActiveGetAll_CacheKey',
    DOMAIN_INSERT : 'Domain Insert',
    DOMAIN_UPDATE : 'Domain Update',
    DOMAIN_DELETE : 'Domain Delete',

    //// Framework
    FRAMEWORKGETALL_CACHEKEY : 'FrameworkGetAll_CacheKey',
    FRAMEWORK_CACHEKEY : 'Framework_',
    FRAMEWORKACTIVEGETALL_CACHEKEY : 'FrameworkActiveGetAll_CacheKey',
    FRAMEWORK_INSERT : 'Framework Insert',
    FRAMEWORK_UPDATE : 'Framework Update',
    FRAMEWORK_DELETE : 'Framework Delete',

    //// Language
    LANGUAGEGETALL_CACHEKEY : 'LanguageGetAll_CacheKey',
    LANGUAGE_CACHEKEY : 'Language_',
    LANGUAGEACTIVEGETALL_CACHEKEY : 'LanguageActiveGetAll_CacheKey',
    LANGUAGE_INSERT : 'Language Insert',
    LANGUAGE_UPDATE : 'Language Update',
    LANGUAGE_DELETE : 'Language Delete',

    //// Operating System
    OPERATINGSYSTEMGETALL_CACHEKEY : 'OperatingSystemGetAll_CacheKey',
    OPERATINGSYSTEM_CACHEKEY : 'OperatingSystem_',
    OPERATINGSYSTEMACTIVEGETALL_CACHEKEY : 'OperatingSystemActiveGetAll_CacheKey',
    OPERATINGSYSTEM_INSERT : 'OperatingSystem Insert',
    OPERATINGSYSTEM_UPDATE : 'OperatingSystem Update',
    OPERATINGSYSTEM_DELETE : 'OperatingSystem Delete',

    //// Project
    PROJECTGETALL_CACHEKEY : 'ProjectGetAll_CacheKey',
    PROJECT_CACHEKEY : 'Project_',
    PROJECTACTIVEGETALL_CACHEKEY : 'ProjectActiveGetAll_CacheKey',
    PROJECT_INSERT : 'Project Insert',
    PROJECT_UPDATE : 'Project Update',
    PROJECT_DELETE : 'Project Delete',

    //// Project Role
    PROJECTROLEGETALL_CACHEKEY : 'ProjectRoleGetAll_CacheKey',
    PROJECTROLE_CACHEKEY : 'ProjectRole_',
    PROJECTROLEACTIVEGETALL_CACHEKEY : 'ProjectRoleActiveGetAll_CacheKey',
    PROJECTROLE_INSERT : 'ProjectRole Insert',
    PROJECTROLE_UPDATE : 'ProjectRole Update',
    PROJECTROLE_DELETE : 'ProjectRole Delete',

    //// Technology
    TECHNOLOGYGETALL_CACHEKEY : 'TechnologyGetAll_CacheKey',
    TECHNOLOGY_CACHEKEY : 'Technology_',
    TECHNOLOGYACTIVEGETALL_CACHEKEY : 'TechnologyActiveGetAll_CacheKey',
    TECHNOLOGY_INSERT : 'Technology Insert',
    TECHNOLOGY_UPDATE : 'Technology Update',
    TECHNOLOGY_DELETE : 'Technology Delete',

    //// User
    USERGETALL_CACHEKEY : 'UserGetAll_CacheKey',
    USER_CACHEKEY : 'User_',
    USERACTIVEGETALL_CACHEKEY : 'UserActiveGetAll_CacheKey',
    USER_INSERT : 'User Insert',
    USER_UPDATE : 'User Update',
    USER_DELETE : 'User Delete',

    //// Role
    ROLEGETALL_CACHEKEY : 'RoleGetAll_CacheKey',
    ROLE_CACHEKEY : 'Role_',
    ROLEACTIVEGETALL_CACHEKEY : 'RoleActiveGetAll_CacheKey',
    ROLE_INSERT : 'Role Insert',
    ROLE_UPDATE : 'Role Update',
    ROLE_DELETE : 'Role Delete',

    //// Permission Module
    PERMISSIONMODULEGETALL_CACHEKEY : 'PermissionModuleGetAll_CacheKey',

    //// User Permission
    USERPERMISSIONGETALL_CACHEKEY : 'UserPermissionGetAll_CacheKey',
    USERPERMISSION_INSERT : 'UserPermission Insert',

    //// Role Permission
    ROLEPERMISSIONGETALL_CACHEKEY : 'RolePermissionGetAll_CacheKey',
    ROLEPERMISSION_INSERT : 'RolePermission Insert',

    //// Resume
    RESUMEGETALL_CACHEKEY : 'ResumeGetAll_CacheKey',
    RESUME_CACHEKEY : 'Resume_',
    RESUMEACTIVEGETALL_CACHEKEY : 'ResumeActiveGetAll_CacheKey',
    RESUME_INSERT : 'Resume Insert',
    RESUME_UPDATE : 'Resume Update',
    RESUME_DELETE : 'Resume Delete'
};

module.exports = Constants;