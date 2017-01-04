/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-15T13:39:31+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-03-19T03:34:25+08:00
* @License: The MIT License (MIT)
*/


const express = require('express');
const config = require('./config');
var bodyParser = require('body-parser')


const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.post('/oauth/users/login', (req, res) => {
  const id = req.body.id;
  const username = req.body.username;
  const password = req.body.password;
  const dynamic = req.body.dynamic;
  const staticdynamic = req.body.staticdynamic;

  if (staticdynamic) {
    if ((config.mock.username === username || config.mock.id === id) &&
      config.mock.password+config.mock.dynamic === password) {
      return res.send({
        code: 0,
        msg: 'ok',
        data: {
          value: {
            username: username,
            id: config.mock.id,
          }
        }
      });
    } else {
      return res.send({
        code: 40000,
        msg: 'param is not right',
        data: {
          value: {
            username: username,
            id: config.mock.id,
          }
        }
      });
    }
  }

  if (dynamic) {
    if (config.mock.username === username && config.mock.dynamic == password) {
      return res.send({
        code: 0,
        msg: 'ok',
        data: {
          value: {
            username: username,
            id: config.mock.id,
          }
        }
      });
    } else if (config.mock.id === id && config.mock.dynamic == password) {
      return res.send({
        code: 0,
        msg: 'ok',
        data: {
          value: {
            username: username,
            id: config.mock.id,
          }
        }
      });
    }
  } else {
    if (config.mock.username === username && config.mock.password == password) {
      return res.send({
        code: 0,
        msg: 'ok',
        data: {
          value: {
            username: username,
            id: config.mock.id,
          }
        }
      });
    } else if (config.mock.id === id && config.mock.password == password) {
      return res.send({
        code: 0,
        msg: 'ok',
        data: {
          value: {
            username: username,
            id: config.mock.id,
          }
        }
      });
    }
  }
});

app.get('/oauth/users/one', (req, res) => {
  return res.send({
    code: 0,
    msg: 'ok',
    data: {
      value: {
        username: config.mock.username,
        id: config.mock.id,
      }
    }
  });
});

app.listen(3000, () => {
  console.log('mock app listening on port 3000!');
});
