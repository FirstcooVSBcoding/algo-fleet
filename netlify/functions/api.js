const https = require('https');

exports.handler = async (event) => {
  const PROVIDER_KEY = '96629a2842e6d7ada54a17f55fceefaf522327e90a86691c2f659602c621a292';
  const companyKey = event.headers['x-company-key'] || '';
  const path = event.queryStringParameters?.path || '/v2/drivers';
  const params = event.queryStringParameters?.params || '';
  
  const fullUrl = params 
    ? `https://api.drivehos.app${path}?${params}`
    : `https://api.drivehos.app${path}`;
  
  return new Promise((resolve) => {
    const req = https.request(fullUrl, {
      method: 'GET',
      headers: {
        'X-API-Provider-Key': PROVIDER_KEY,
        'X-API-Company-Key': companyKey,
        'accept': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: data
        });
      });
    });
    req.on('error', (e) => {
      resolve({
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: e.message })
      });
    });
    req.end();
  });
};
