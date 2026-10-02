import assert from 'node:assert/strict';
import handler from '../api/early-access.mjs';

const originalFetch = globalThis.fetch;
async function request(method, body) {
  const response = { headers: {}, statusCode: 200, body: null,
    setHeader(key, value) { this.headers[key] = value; },
    status(value) { this.statusCode = value; return this; },
    json(value) { this.body = value; return this; },
  };
  await handler({ method, body }, response);
  return response;
}

try {
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('Unexpected upstream call'); };
  const get = await request('GET');
  assert.equal(get.statusCode, 405);
  assert.equal(get.headers.Allow, 'POST');
  for (const email of ['', 'invalid', 'person@domain', 'a'.repeat(255) + '@example.com']) {
    assert.equal((await request('POST', { email })).statusCode, 400);
  }
  assert.equal(calls, 0, 'Invalid submissions must never reach the email list');

  globalThis.fetch = async (url, options) => {
    assert.equal(new URL(url).hostname, 'api-v2.appdeploy.ai');
    assert.deepEqual(JSON.parse(options.body), { email: 'person@example.com' });
    assert.equal(options.method, 'POST');
    assert.ok(options.signal, 'Upstream request must be bounded');
    return { ok: true, json: async () => ({ joined: true }) };
  };
  const success = await request('POST', { email: ' Person@Example.com ' });
  assert.equal(success.statusCode, 201);
  assert.deepEqual(success.body, { joined: true });
  assert.equal(success.headers['Cache-Control'], 'no-store');

  for (const upstream of [
    { ok: false, json: async () => ({ error: 'Unable to join' }) },
    { ok: true, json: async () => ({ joined: false }) },
    { ok: true, json: async () => ({}) },
    { ok: true, json: async () => { throw new Error('Non-JSON response'); } },
  ]) {
    globalThis.fetch = async () => upstream;
    const failed = await request('POST', { email: 'person@example.com' });
    assert.equal(failed.statusCode, 502);
    assert.equal(failed.body.joined, undefined, 'Upstream failure must not claim signup');
  }
  globalThis.fetch = async () => { throw new Error('Network unavailable'); };
  assert.equal((await request('POST', { email: 'person@example.com' })).statusCode, 502);
  console.log('PASS: method, validation, normalization, confirmed persistence, cache, timeout signal, and failure handling. No live signup created.');
} finally {
  globalThis.fetch = originalFetch;
}
