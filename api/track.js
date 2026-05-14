import { supabase } from '../lib/supabase';

export default async function handler(req, res) {
  // 1. Capture visitor data from Vercel headers
  const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  const city = req.headers['x-vercel-ip-city'] || 'unknown';
  const country = req.headers['x-vercel-ip-country'] || 'unknown';

  try {
    // 2. Insert into Supabase 'events' table
    await supabase.from('events').insert([
      {
        ip: ip,
        user_agent: userAgent,
        city: city,
        country: country,
        query_params: req.query
      }
    ]);
  } catch (error) {
    console.error("Logging failed:", error);
    // We continue so the image still loads
  }

  // 3. Create a 1x1 transparent PNG pixel
  const pixel = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mP8/5+hEgAHggICLsrS8AAAAABJRU5ErkJggg==',
    'base64'
  );

  // 4. Force browser to NOT cache this image (so it fires every time)
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // 5. Send response
  return res.status(200).send(pixel);
}
