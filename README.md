# CAS-LDAP ![Branch master](https://img.shields.io/badge/branch-master-brightgreen.svg?style=flat-square)[![Build](https://api.travis-ci.org/detailyang/cas-ldap.svg)](https://travis-ci.org/detailyang/cas-ldap)[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/detailyang/cas-ldap/master/LICENSE)

A component for support ldap protocol ([RFC 4511](https://tools.ietf.org/html/rfc4511)) integrated with [CAS](https://github.com/detailyang/cas-server). CAS-LDAP can be used to integrate with software which supoort ldap such as  gitlab、jira、confluence、jenkins、gerrit、vpn device、phabricator、grafana. check these [configuration](https://github.com/detailyang/cas-ldap/tree/master/docs/images), you will find the configuration.


Table of Contents
-----------------

  * [Requirements](#requirements)
  * [Development](#development)
  * [Test](#test)
  * [Production](#production)
  * [Contributing](#contributing)
  * [License](#license)


Requirements
------------
CAS-LDAP requires the following to run:

[Node.js][node] (personally recommand latest release version)    
[Npm][npm] (normally comes with Node.js)     
[CAS][cas] (personally recommand latest release version)    


Development
-----------
looking at config.js, CAS-LDAP will listen at port 1636 (ldaps) and port 1389 (ldap) and CAS-LDAP will request CAS api http://127.0.0.1:3000 as default. if your CAS server is not on http://127.0.0.1:3000, you can set environment CAS_LDAP_CAS_DOMAIN and CAS_LDAP_CAS_SECRET.

````bash
npm install
NODE_ENV=dev node index.js
````

Test
------------
CAS-LDAP provides eight ways api as follow:
 1. admin password bind
 2. static password username bind
 3. static password id bind
 4. dynamic password username bind
 5. dynamic password id bind
 6. static dynamic password username bind
 7. static dynamic password id bind
 8. search user
  
For sure these core api is ok, please pass tests when change code.

````bash
NODE_ENV=test node index.js
NODE_ENV=test node mock.js # a mock server for cas

# make sure above two process run in background
NODE_ENV=test node_modules/mocha/bin/mocha test.js
````

Production
----------
For deploy node.js application, any process management like PM2、Forever、Supervisor is ok. Anyway, before startup CAS-LDAP, you must should set environment as follow:
````bash
export CAS_LDAP_LDAP_TLS_PORT=636
export CAS_LDAP_LDAP_TLS_HOST=0.0.0.0
export CAS_LDAP_LDAP_NOTLS_PORT=389
export CAS_LDAP_LDAP_NOTLS_HOST=0.0.0.0
export CAS_LDAP_LDAP_BASE=dc=example,dc=com
export CAS_LDAP_ADMIN_USERNAME=root
export CAS_LDAP_ADMIN_PASSWORD=123123123123123123
export CAS_LDAP_CAS_DOMAIN=https://cas.example.com
export CAS_LDAP_CAS_SECRET=36229359-9178-416f-a6f3-f9d9d5e0ddbe
export CAS_LDAP_SYSLOG_HOSTNAME=10.10.0.3
export CAS_LDAP_SYSLOG_PORT=514
export CAS_LDAP_SYSLOG_FACILITY=local6
export CAS_LDAP_SYSLOG_TAG='cas-ldap'
export CAS_LDAP_LDAP_TLS_KEY=/opt/cas-ldap/etc/example.com.key
export CAS_LDAP_LDAP_TLS_CERT=/opt/cas-ldap/etc/example.com.crt
````

By the way, to monitor the CAS-LDAP and CAS status, periodically run real test is necessary. Personally recommand to checkout monitor.js and create the user 'monitor' on CAS server.
````
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
  dynamic: (()=>{
    const key = password.decodeGoogleSecret('EQZGCJBRGASGU422GBXW4ZLDJVXEQT3FJNKWMUSHHFAVSZLWIRWTQWKVKBVHS3DYOY3GM5LBKEZTKNDPORFTASRVOFTVC2LN');
    const otpcode = password.otpgen(key);

    return otpcode;
  })(),
};
````

Once ready for monitor.js, run the command periodically as follow:
````bash
NODE_ENV=production node_modules/mocha/bin/mocha monitor.js
````

Contributing
------------
To contribute to CAS-LDAP, clone this repo locally and commit your code on a separate branch then send a pull request.


License
-------

CAS-LDAP is licensed under the [MIT](#) license.  

[node]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[cas]: https://github.com/detailyang/cas-server
