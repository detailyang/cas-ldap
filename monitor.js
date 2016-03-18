/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-18T12:08:27+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-03-18T12:26:41+08:00
* @License: The MIT License (MIT)
*/


const ldap = require('ldapjs');

const config = require('./config');


config.mock = {
  username: 'monitor',
  password: 'monitor_MM',
  id: '466',
  gender: 0,
  realname: 'monitor',
  aliasname: 'monitor',
  mobile: '1234567890',
  email: 'monitor@example.com',
  key: '',
  dynamic: 'abababaaaaa',
};

require('./test');
