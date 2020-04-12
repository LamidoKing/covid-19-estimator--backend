const express = require('express');
const js2xmlparser = require('js2xmlparser');
const covid19ImpactEstimator = require('./covid-19/estimator');

const createApp = () => {
  const app = express();

  app.use(express.json());

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
        status: 'success',
        data
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

      const xmlData = js2xmlparser.parse('a', data);

      return res.status(200).send(xmlData);
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
