/*
 * @Author: detailyang
 * @Date:   2015-03-01 20:34:37
* @Last modified by:   detailyang
* @Last modified time: 2016-03-13T18:07:31+08:00
 */
const config = module.exports;
if (process.env.NODE_ENV == 'dev') {
  config.ldap = {
    port: 389,
    host: '0.0.0.0',
    base: 'dc=youzan,dc=com',
    admin: {
      username: 'root',
      password: 'test',
    },
    user: {
      username: 'user',
    },
  };
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
} else {
  config.ldap = {
    port: 389,
    host: '127.0.0.1',
    base: 'dc=youzan,dc=com',
    admin: {
      username: 'root',
      password: 'test',
    },
    user: {
      username: 'user',
    },
  };
}

config.dn = {
  static: `dc=${config.ldap.user.username},${config.ldap.base}`,
  dynamic:  `dc=dynamic,dc=${config.ldap.user.username},${config.ldap.base}`,
  admin: `dc=${config.ldap.admin.username},${config.ldap.base}`,
};
