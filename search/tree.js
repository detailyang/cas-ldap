/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-13T16:59:16+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-03-15T13:37:07+08:00
* @License: The MIT License (MIT)
*/


const config = require('../config');
const rp = require('request-promise');
const errors = require('request-promise/errors');
const co = require('co');
const ldap = require('ldapjs');


const search = (req, res, next) => {
  req.log.info({
    ip: req.connection.ldap.id,
    type: 'tree search',
    version: req.version || '-1',
    dn: req.dn.toString(),
    filter: req.filter.toString(),
    scope: req.scope,
  });
  switch (req.scope) {
     case 'base':
      res.send({
        dn: "",
        attributes: {
          "objectclass": ["top","OpenLDAProotDSE"],
          "structuralobjectclass": "OpenLDAProotDSE",
          "configcontext": "cn=config",
          "monitorcontext": "cn=Monitor",
          "namingcontexts": config.dn.dynamic,
          "supportedcontrol": ["2.16.840.1.113730.3.4.18","2.16.840.1.113730.3.4.2",
                               "1.3.6.1.4.1.4203.1.10.1","1.2.840.113556.1.4.319","1.2.826.0.1.3344810.2.3","1.3.6.1.1.13.2","1.3.6.1.1.13.1","1.3.6.1.1.12"],
          "supportedextension": ["1.3.6.1.4.1.1466.20037","1.3.6.1.4.1.4203.1.11.1","1.3.6.1.4.1.4203.1.11.3","1.3.6.1.1.8"
          ],
          "supportedfeatures": ["1.3.6.1.1.14","1.3.6.1.4.1.4203.1.5.1","1.3.6.1.4.1.4203.1.5.2","1.3.6.1.4.1.4203.1.5.3","1.3.6.1.4.1.4203.1.5.4","1.3.6.1.4.1.4203.1.5.5"],
          "supportedldapversion": "3",
          "entrydn": " ",
          "subschemasubentry":"cn=Subschema",
          "dn": " "}
      });
      break;
    case 'sub':
      break;
  default:
      break
  }
  res.end();
}

module.exports = search;
