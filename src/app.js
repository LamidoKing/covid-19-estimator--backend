const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const convert = require('xml-js');
const covid19ImpactEstimator = require('./covid-19/estimator');
const responseType = require('./utils/index');

const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(morgan('tiny'));

  app.use(
    morgan(
      (tokens, req, res) => {
        let resTime = parseInt(
          tokens['response-time'](req, res),
          10
        ).toString();

        if (resTime.length === 1) resTime = `0${resTime}`;

        const log = [
          tokens.method(req, res),
          tokens.url(req, res),
          tokens.status(req, res),
          resTime
        ].join('\t\t');

        return `${log}ms`;
      },
      {
        stream: fs.createWriteStream(path.join(__dirname, 'logs.txt'), {
          flags: 'a'
        })
      }
    )
  );

  app.post('/api/v1/on-covid-19', async (req, res) => {
    try {
      const data = await covid19ImpactEstimator(req.body);

      return res.status(200).json({
        ...data
      });
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        error
      });
    }
  });

  app.post('/api/v1/on-covid-19/:param', async (req, res) => {
    try {
      const { param } = req.params;

      responseType(res, param);

      const data = await covid19ImpactEstimator(req.body);

      if (param === 'xml') {
        const options = { compact: true, ignoreComment: true, spaces: 4 };

        const xmlData = await convert.json2xml(data, options);

        return res.status(200).send(xmlData);
      }

      return res.status(200).json({
        ...data
      });
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        error
      });
    }
  });

  app.get('/api/v1/on-covid-19/logs', async (req, res) => {
    try {
      res.setHeader('Content-Type', 'text/plain');

      return fs.readFile('./logs.txt', (err, data) => {
        if (err) {
          res.send(err);
          return;
        }
        res.status(200).send(data);
      });
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        error
      });
    }
  });

  return app;
};

module.exports = createApp;
