/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-13T14:36:24+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-04-20T19:05:39+08:00
* @License: The MIT License (MIT)
*/


const ldap = require('ldapjs');
const rp = require('request-promise');
const errors = require('request-promise/errors');
const co = require('co');
const fs = require('fs');
const config = require('./config');
const winston = require('winston');
require('winston-syslog').Syslog;


winston.add(winston.transports.Syslog, {
  host: config.syslog.hostname,
  port: config.syslog.port,
  facility: config.syslog.facility,
  app_name: config.syslog.tag,
});
winston.trace = () => {};
//winston.remove(winston.transports.Console);
const headers = {
  authorization: `oauth ${config.cas.secret}`,
};

const createLDAP = (type) => {
  if (type == 'tls') {
    var server = ldap.createServer({
      log: winston,
      certificate: fs.readFileSync(config.ssl.cert),
      key: fs.readFileSync(config.ssl.key),
    });
    server.listen(config.ldap.tls.port, config.ldap.tls.host, () => {
      console.log('cas-ldap listening at ' + server.url);
    });
    return server;
  } else {
    var server = ldap.createServer({
      log: winston,
    });
    server.listen(config.ldap.notls.port, config.ldap.notls.host, () => {
      console.log('cas-ldap listening at ' + server.url);
    });
    return server;
  }
};

listenAndServe = (server) => {
  server.on('close', (err) => {
    console.log('ldap server closed');
  });

  // admin password bind
  server.bind(config.dn.admin, (req, res, next) => {
    req.log.info({
      ip: req.connection.ldap.id,
      type: 'admin bind',
      version: req.version || '-1',
      dn: req.dn.toString(),
    });
    if (req.version !== 3) {
      return next(new ldap.ProtocolError(`${req.version} is not v3`));
    }
    if (req.credentials !== config.ldap.admin.password) {
      return next(new ldap.InvalidCredentialsError(req.dn.toString()));
    }
    res.end();
  });

  // dynamic password bind
  server.bind(config.dn.dynamic, (req, res, next) => {
    req.log.info({
      ip: req.connection.ldap.id,
      type: 'dynamic user bind',
      version: req.version || '-1',
      dn: req.dn.toString(),
    });
    try {
      const id = req.dn.toString().split(',')[0].split('=')[1];
    } catch (e) {
      id = 0;
    }
    const field = !isNaN(parseFloat(id)) && isFinite(id) ? 'id' : 'username';
    const body = {persistence: 0};
    body[field] = id;
    body['password'] = req.credentials;
    body['dynamic'] = true;

    co(function *() {
      const options = {
        uri: `${config.cas.domain}${config.cas.api.checkLogin.endpoint}`,
        method: config.cas.api.checkLogin.method,
        body: body,
        json: true,
        headers: headers,
      };
      const resp = yield rp(options).catch(errors.RequestError, (reason) => {
      });
      if (!resp) {
        next(new ldap.UnavailableError());
        return res.end();
      }
      if (resp.code !== 0) {
        next(new ldap.InvalidCredentialsError(resp.data.value));
        return res.end();
      }
      return res.end();
    })
    .catch((err) => {
      next(new ldap.UnavailableError(err.message));
      return res.end();
    })
  });

  // static dynamic bind
  server.bind(config.dn.staticdynamic, (req, res, next) => {
    req.log.info({
      ip: req.connection.ldap.id,
      type: 'static dynamic user bind',
      version: req.version || '-1',
      dn: req.dn.toString(),
    });
    try {
      const id = req.dn.toString().split(',')[0].split('=')[1];
    } catch (e) {
      id = 0;
    }
    const field = !isNaN(parseFloat(id)) && isFinite(id) ? 'id' : 'username';
    const body = {persistence: 0};
    body[field] = id;
    body['password'] = req.credentials;
    body['staticdynamic'] = true;

    co (function *() {
      const options = {
        uri: `${config.cas.domain}${config.cas.api.checkLogin.endpoint}`,
        method: config.cas.api.checkLogin.method,
        body: body,
        json: true,
        headers: headers,
      };
      const resp = yield rp(options).catch(errors.RequestError, (reason) => {
        next(new ldap.UnavailableError(reason));
      });
      if (!resp) {
        return res.end();
      }
      if (resp.code !== 0) {
        next(new ldap.InvalidCredentialsError(resp.data.value));
        return res.end();
      }
      return res.end();
    })
    .catch((err) => {
      next(new ldap.UnavailableError(err.message));
      return res.end();
    });
  });

  // static password bind
  server.bind(config.dn.static, (req, res, next) => {
    req.log.info({
      ip: req.connection.ldap.id,
      type: 'static user bind',
      version: req.version || '-1',
      dn: req.dn.toString(),
    });
    try {
      const id = req.dn.toString().split(',')[0].split('=')[1];
    } catch (e) {
      id = 0;
    }
    const field = !isNaN(parseFloat(id)) && isFinite(id) ? 'id' : 'username';
    const body = {persistence: 0};
    body[field] = id;
    body['password'] = req.credentials;

    co (function *() {
      const options = {
        uri: `${config.cas.domain}${config.cas.api.checkLogin.endpoint}`,
        method: config.cas.api.checkLogin.method,
        body: body,
        json: true,
        headers: headers,
      };
      const resp = yield rp(options).catch(errors.RequestError, (reason) => {
        next(new ldap.UnavailableError(reason));
      });
      if (!resp) {
        return res.end();
      }
      if (resp.code !== 0) {
        next(new ldap.InvalidCredentialsError(resp.data.value));
        return res.end();
      }
      return res.end();
    })
    .catch((err) => {
      next(new ldap.UnavailableError(err.message));
      return res.end();
    });
  });

  const search = require('./search');

  // allow search '' to get the tree
  server.search('', search.tree);
  server.search(config.ldap.base, search.tree);
  server.search(config.dn.staticdynamic, search.user.staticdynamic);
  server.search(config.dn.dynamic, search.user.dynamic);
  server.search(config.dn.static, search.user.static);

  server.unbind((req, res, next) => {
    res.end();
  });
}

const server = createLDAP('tls');
const servers = createLDAP('notls');
listenAndServe(server);
listenAndServe(servers);
