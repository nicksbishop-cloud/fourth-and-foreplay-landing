export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }); }
  const email = String(req.body?.email || '').trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Valid email required' });
  try {
    const upstream = await fetch('https://api-v2.appdeploy.ai/app/fourth-foreplay-ejki11/api/early-access', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }), signal: AbortSignal.timeout(10000),
    });
    const result = await upstream.json();
    if (!upstream.ok || result.joined !== true) return res.status(502).json({ error: 'Signup unavailable' });
    return res.status(201).json({ joined: true });
  } catch { return res.status(502).json({ error: 'Signup unavailable' }); }
}
