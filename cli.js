#!/usr/bin/env node

const devcert = require('devcert');
const https = require('https');
const http = require('http');
const express = require('express');
const httpProxy = require('http-proxy');
const cosmiconfig = require('cosmiconfig');
const chalk = require('chalk');

const explorer = cosmiconfig('devserver');
const app = express();
const apiProxy = httpProxy.createProxyServer();

(async () => {
  const { config } = explorer.searchSync() || {};

  if (!config) {
    throw new Error('No configuration file or key has been provided.');
  }

  const isSecure = typeof config.ssl === 'boolean' ? config.ssl : true;
  const port = isSecure ? 443 : 80;
  const hostName = config.domain || 'localhost.dev';
  const rules = Array.isArray(config.rules) ? config.rules : [];
  const ssl = await devcert.certificateFor(hostName);

  rules.forEach(rule => {
    app.all(rule.path, (req, res) => {
      console.log(
        chalk.gray(`[${req.method}] ${req.path}`) +
          ' -> ' +
          rule.target +
          req.path
      );
      apiProxy.web(req, res, { target: rule.target }, err => {
        console.error(err);
        res.send(err);
      });
    });
  });

  console.log(
    'Serving on ' + chalk.green(`${isSecure ? 'https' : 'http'}://${hostName}`)
  );
  (isSecure ? https : http).createServer(ssl, app).listen(port, hostName);
})();
