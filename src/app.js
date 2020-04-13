const express = require('express');
const convert = require('xml-js');
const covid19ImpactEstimator = require('./covid-19/estimator');

const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

  app.post('/api/v1/on-covid-19/json', async (req, res) => {
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

  app.post('/api/v1/on-covid-19/xml', async (req, res) => {
    try {
      const data = await covid19ImpactEstimator(req.body);

      const options = { compact: true, ignoreComment: true, spaces: 4 };

      const xmlData = await convert.json2xml(data, options);

      return res.status(200).type('application/xml').send(xmlData);
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        error
      });
    }
  });

  app.get('/api/v1/on-covid-19/logs', (req, res) => {
    res.send('logs');
  });

  return app;
};

module.exports = createApp;
