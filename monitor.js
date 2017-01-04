/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-18T12:08:27+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-03-30T11:18:56+08:00
* @License: The MIT License (MIT)
*/


const ldap = require('ldapjs');
const password = require('./utils/password');
const config = require('./config');
const salt = process.env.CAS_NOTP_SALT || '$2a$10$jsZ0onecMnHOeKUfRG9AYe';

config.mock = {
  username: 'monitor',
  password: 'monitor_MM',
  id: '482',
  gender: 0,
  realname: 'monitor',
  aliasname: 'monitor',
  mobile: '1234567890',
  email: 'monitor@example.com',
  key: '',
  dynamic: (()=>{
    const key = password.decodeGoogleSecret('EQZGCJBRGASGU422GBXW4ZLDJVXEQT3FJNKWMUSHHFAVSZLJI5MGYY3OOFWEIQLBI5STQV3SPFVXA3JXOQZHA6LBJZIGMQLR');
    const otpcode = password.otpgen(key);

    return otpcode;
  })(),
};


require('./test');
