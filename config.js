/*
 * @Author: detailyang
 * @Date:   2015-03-01 20:34:37
* @Last modified by:   detailyang
* @Last modified time: 2016-03-17T17:19:27+08:00
 */


const config = module.exports;

config.cas = {
  domain: 'http://127.0.0.1:3000',
  secret: 'ebc4a530-e87c-11e5-8fb6-6fd23b62767f',
  api: {
    checkLogin: {
      method: 'POST',
      endpoint: '/oauth/users/login',
    },
    getUser: {
      method: 'GET',
      endpoint: '/oauth/users/one',
    },
    filterUser: {
      method: 'GET',
      endpoint: '/oauth/users/one',
    },
  },
};

config.syslog = {
  hostname: process.env.CAS_LDAP_SYSLOG_HOSTNAME || 'localhost',
  port: process.env.CAS_LDAP_SYSLOG_PORT || '514',
  facility: process.env.CAS_LDAP_SYSLOG_FACILITY || 'local6',
  tag: process.env.CAS_LDAP_SYSLOG_TAG || 'cas-ldap',
};

config.ssl = {
  key: process.env.CAS_SSL_KEY || 'ssl/server.key',
  cert: process.env.CAS_SSL_CERT || 'ssl/server.crt',
};

if (process.env.NODE_ENV === 'dev') {
  config.ldap = {
    tls: {
      port: 636,
      host: '0.0.0.0',
    },
    notls: {
      port: 389,
      host: '0.0.0.0',
    },
    base: 'dc=cas,dc=com',
    admin: {
      username: 'root',
      password: 'test',
    },
    user: {
      username: 'user',
    },
  };
  config.cas.domain = 'http://127.0.0.1:3000';
  config.cas.secret = 'ebc4a530-e87c-11e5-8fb6-6fd23b62767f';
} else if (process.env.NODE_ENV === 'test'){
  config.mock = {
    username: 'admin',
    password: 'password',
    id: '1',
    gender: 0,
    realname: 'admin',
    aliasname: 'admin',
    mobile: '1234567890',
    email: 'amdin@example.com',
    key: '',
    dynamic: 'abababaaaaa',
  };
  config.ldap = {
    tls: {
      port: 1636,
      host: '0.0.0.0',
    },
    notls: {
      port: 389,
      host: '0.0.0.0',
    },
    base: 'dc=cas,dc=com',
    admin: {
      username: 'root',
      password: 'test',
    },
    user: {
      username: 'user',
    },
  };
  config.cas.domain = 'http://127.0.0.1:3000';
  config.cas.secret = 'ebc4a530-e87c-11e5-8fb6-6fd23b62767f';
} else {
  config.ldap = {
    tls: {
      port: process.env.CAS_LDAP_LDAP_TLS_PORT,
      host: process.env.CAS_LDAP_LDAP_TLS_HOST,
    },
    notls: {
      port: process.env.CAS_LDAP_LDAP_NOTLS_PORT,
      host: process.env.CAS_LDAP_LDAP_NOTLS_HOST,
    },
    base: process.env.CAS_LDAP_LDAP_BASE,
    admin: {
      username: process.env.CAS_LDAP_ADMIN_USERNAME,
      password: process.env.CAS_LDAP_ADMIN_PASSWORD,
    },
    user: {
      username: process.env.CAS_LDAP_USER_USERNAME || 'user',
    }
  };
  config.cas.domain = process.env.CAS_LDAP_CAS_DOMAIN;
  config.cas.secret = process.env.CAS_LDAP_CAS_SECRET;
}

config.dn = {
  static: `dc=${config.ldap.user.username},${config.ldap.base}`,
  dynamic:  `dc=dynamic,dc=${config.ldap.user.username},${config.ldap.base}`,
  staticdynamic: `dc=staticdynamic,dc=${config.ldap.user.username},${config.ldap.base}`,
  tree:  `dc=tree,dc=${config.ldap.user.username},${config.ldap.base}`,
  admin: `dc=${config.ldap.admin.username},${config.ldap.base}`,
};
