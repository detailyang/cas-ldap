/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-13T16:59:16+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-04-20T19:06:07+08:00
* @License: The MIT License (MIT)
*/


'use strict'
const config = require('../config');
const rp = require('request-promise');
const errors = require('request-promise/errors');
const co = require('co');
const ldap = require('ldapjs');


const headers = {
  authorization: `oauth ${config.cas.secret}`,
};

const search = (type) => {
  return (req, res, next) => {
    req.log.info({
      ip: req.connection.ldap.id,
      type: `${type} user search`,
      version: req.version || '-1',
      dn: req.dn.toString(),
      filter: req.filter.toString(),
      scope: req.scope,
    });
    co(function *() {
      const query = {};
      const dn = req.dn.toString().replace(/\s+/g, '');
      const l = dn.split('dc').length-1
      // maybe support equal only is enough
      req.filter.map((f) => {
        if (f.type === 'equal') {
          query['field'] = f.attribute;
          query['value'] = f.value;
        }
      });

      if (l >= 4
          && dn !== config.dn.staticdynamic
          && dn !== config.dn.dynamic
          && dn !== config.dn.static
      ) {
        let id = 0;
        try {
          id = dn.split(',')[0].split('=')[1];
        } catch (e) {
          id = 0;
        }
        const field = !isNaN(parseFloat(id)) && isFinite(id) ? 'id' : 'username';
        query['field'] = field;
        query['value'] = id;
      }
      const options = {
        uri: `${config.cas.domain}${config.cas.api.getUser.endpoint}`,
        method: config.cas.api.getUser.method,
        qs: query,
        json: true,
        headers: headers,
      };
      const resp = yield rp(options).catch(errors.RequestError, (reason) => {
        console.log(reason);
      });
      if (!resp) {
        next(new ldap.UnavailableError());
        return res.end();
      }
      if (resp.code !== 0) {
        next(new ldap.NoSuchObjectError(resp.data.value));
        return res.end();
      }
      const user = resp.data.value;
      let basedn = `dc=${user.username},${config.dn.static}`;
      if (type == 'static') {
        basedn = `dc=${user.username},${config.dn.static}`;
      } else if (type == 'dynamic') {
        basedn = `dc=${user.username},${config.dn.dynamic}`;
      } else if (type == 'staticdynamic'){
        basedn = `dc=${user.username},${config.dn.staticdynamic}`;
      }
      res.send({
        dn: basedn,
        attributes: user
      });
      return res.end();
    })
    .catch((err) => {
      console.log(err);
    });
  }
}

module.exports = {
  static: search('static'),
  dynamic: search('dynamic'),
  staticdynamic: search('staticdynamic'),
};
