const responseType = (res, param) => {
  if (param === 'json') {
    return res.setHeader('Content-Type', 'application/json');
  }

  if (param === 'xml') {
    return res.setHeader('Content-Type', 'application/xml');
  }

  throw new Error('URL not Valid');
};

module.exports = responseType;
