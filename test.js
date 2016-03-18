/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-13T15:27:41+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-03-18T13:41:11+08:00
* @License: The MIT License (MIT)
*/


const should = require('should');
const ldap = require('ldapjs');
const expect = require('chai').expect;

const config = require('./config');
const client = ldap.createClient({
  url: `ldaps://${config.ldap.tls.host}:${config.ldap.tls.port}`,
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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
    client.bind(`dc=${config.mock.username},${config.dn.static}`,
      config.mock.password, (err) => {
        expect(err).to.be.null;
        done();
    });
  });
});

describe('ldap static password id bind', function(){
  it('should return sucess', function(done){
    client.bind(`dc=${config.mock.id},${config.dn.static}`,
      config.mock.password, (err) => {
        expect(err).to.be.null;
        done();
    });
  });
});

describe('ldap dynamic password username bind', function(){
  it('should return sucess', function(done){
    client.bind(`dc=${config.mock.username},dc=dynamic,dc=${config.ldap.user.username},${config.ldap.base}`,
      config.mock.dynamic, (err) => {
        expect(err).to.be.null;
        done();
    });
  });
});

describe('ldap dynamic password id bind', function(){
  it('should return sucess', function(done){
    client.bind(`dc=${config.mock.id},dc=dynamic,dc=${config.ldap.user.username},${config.ldap.base}`,
      config.mock.dynamic, (err) => {
        expect(err).to.be.null;
        done();
    });
  });
});

describe('ldap static dynamic password username bind', function(){
  it('should return sucess', function(done){
    client.bind(`dc=${config.mock.username},dc=staticdynamic,dc=${config.ldap.user.username},${config.ldap.base}`,
      config.mock.password+config.mock.dynamic, (err) => {
        expect(err).to.be.null;
        done();
    });
  });
});

describe('ldap static dynamic password id bind', function(){
  it('should return sucess', function(done){
    client.bind(`dc=${config.mock.id},dc=staticdynamic,dc=${config.ldap.user.username},${config.ldap.base}`,
      config.mock.password+config.mock.dynamic, (err) => {
        expect(err).to.be.null;
        done();
    });
  });
});

describe('ldap search user', function() {
  it('should return success', function(done) {
    var opts = {
      filter: `(email=${config.mock.email})`,
      scope: 'sub',
      attributes: ['*']
    };
    client.search(config.dn.static, opts, function(err, res) {
      expect(err).to.be.null;
      res.on('searchEntry', function(entry) {
        const user = entry.object;
        expect(user.id).to.equal(config.mock.id);
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
