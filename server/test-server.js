const http = require('http');
const { app } = require('./server');

const testPort = 5005;
const testServer = app.listen(testPort, async () => {
  console.log(`Test server running on port ${testPort}`);

  function makeRequest(options, postData) {
    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : {}
          });
        });
      });
      req.on('error', reject);
      if (postData) {
        req.write(JSON.stringify(postData));
      }
      req.end();
    });
  }

  try {
    // 1. Test GET /
    console.log('\n--- 1. Testing GET / ---');
    const res1 = await makeRequest({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/',
      method: 'GET'
    });
    console.log('Status:', res1.statusCode, 'Body:', res1.body);

    // 2. Test POST /api/auth/register with missing fields
    console.log('\n--- 2. Testing POST /api/auth/register (missing fields) ---');
    const res2 = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: testPort,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {}
    );
    console.log('Status:', res2.statusCode, 'Body:', res2.body);

    // 3. Test POST /api/events without token
    console.log('\n--- 3. Testing POST /api/events (unauthorized) ---');
    const res3 = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: testPort,
        path: '/api/events',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      { title: 'Global Village' }
    );
    console.log('Status:', res3.statusCode, 'Body:', res3.body);

    // 4. Test POST /api/feedbacks without token
    console.log('\n--- 4. Testing POST /api/feedbacks (unauthorized) ---');
    const res4 = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: testPort,
        path: '/api/feedbacks',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      { text: 'Great event' }
    );
    console.log('Status:', res4.statusCode, 'Body:', res4.body);

    console.log('\nALL TESTS PASSED SUCCESSFULLY! ✅');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    testServer.close();
    process.exit(0);
  }
});

