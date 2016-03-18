# CAS-LDAP [![Node.js version support](https://img.shields.io/badge/node.js%20support-0.10–5-brightgreen.svg)](https://img.shields.io/badge/node.js%20support-0.10–5-brightgreen.svg)[![Build](https://api.travis-ci.org/detailyang/cas-ldap.svg)](https://api.travis-ci.org/detailyang/cas-ldap.svg)[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://img.shields.io/badge/license-MIT-blue.svg)

A component for support ldap protocol ([RFC 4511](https://tools.ietf.org/html/rfc4511)) integrated with [CAS](https://github.com/detailyang/cas-server). CAS-LDAP can be used to integrate with software which supoort ldap such as  gitlab、jira、confluence、jenkins、gerrit、vpn device、phabricator、grafana. check these [configuration](https://github.com/detailyang/cas-ldap/tree/master/docs/images), you will find the configuration.


Table of Contents
-----------------

  * [Requirements](#requirements)
  * [Development](#development)
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
look at config.js, when you in development environment, CAS-LDAP will listen at port 1636 (ldaps) and port 1389 (ldap) and CAS-LDAP will request CAS api http://127.0.0.1:3000 as default. if your CAS server is not on http://127.0.0.1:3000, you can set environment CAS_LDAP_CAS_DOMAIN and CAS_LDAP_CAS_SECRET.

````bash
NODE_ENV=dev node index.js
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


Contributing
------------
To contribute to CAS-LDAP, clone this repo locally and commit your code on a separate branch.


License
-------

CAS-LDAP is licensed under the [MIT](#) license.  

[node]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[cas]: https://github.com/detailyang/cas-server
