/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-13T15:27:41+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-03-13T18:18:08+08:00
* @License: The MIT License (MIT)
*/


const should = require('should');
const ldap = require('ldapjs');
const expect = require('chai').expect;


const config = require('./config');
const client = ldap.createClient({
  url: `ldap://${config.ldap.host}:${config.ldap.port}`
});

describe('ldap admin password bind', function(){
  it('should return success', (done) => {
    client.bind(config.dn.admin,
      config.ldap.admin.password, (err) => {
        expect(err).to.be.null;
        done();
    });
  });
});

describe('ldap static password username bind', function(){
  it('should return sucess', function(done){
    client.bind(`dc=black,${config.dn.static}`,
      'password', (err) => {
        expect(err).to.be.null;
        done();
    });
  });
});

describe('ldap static password id bind', function(){
  it('should return sucess', function(done){
    client.bind(`dc=1,${config.dn.static}`,
      'password', (err) => {
        expect(err).to.be.null;
        done();
    });
  });
});

// describe('ldap dynamic password username bind', function(){
//   console.log(`dc=black,dc=dynamic,dc=${config.ldap.user.username},${config.ldap.base}`);
//   it('should return sucess', function(done){
//     client.bind(`dc=black,dc=dynamic,dc=${config.ldap.user.username},${config.ldap.base}`,
//       '123456', (err) => {
//         expect(err).to.be.null;
//         done();
//     });
//   });
// });
//
// describe('ldap dynamic password id bind', function(){
//   console.log(`dc=black,dc=dynamic,dc=${config.ldap.user.username},${config.ldap.base}`);
//   it('should return sucess', function(done){
//     client.bind(`dc=1,dc=dynamic,dc=${config.ldap.user.username},${config.ldap.base}`,
//       '655879', (err) => {
//         expect(err).to.be.null;
//         done();
//     });
//   });
// });
describe('ldap search user', function() {
  it('should return success', function(done) {
    var opts = {
      filter: '(email=black@qima-inc.com)',
      scope: 'sub',
      attributes: ['*']
    };
    client.search(config.dn.static, opts, function(err, res) {
      expect(err).to.be.null;
      res.on('searchEntry', function(entry) {
        const user = entry.object;
        expect(user.id).to.equal('1');
      });
      res.on('error', function(err) {
        expect(err).to.be.null;
      });
      res.on('end', function(result) {
        done();
      });
    });
  })
})
