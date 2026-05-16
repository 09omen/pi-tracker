import { supabase } from '../lib/supabase';

export default async function handler(req, res) {
  // Prevent function from crashing globally if headers are empty
  const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  const city = req.headers['x-vercel-ip-city'] || 'unknown';
  const country = req.headers['x-vercel-ip-country'] || 'unknown';

  try {
    // Attempt the insert, but safely capture errors so it never triggers a 500
    if (supabase) {
      await supabase.from('events').insert([
        {
          ip: ip,
          user_agent: userAgent,
          city: city,
          country: country,
          query_params: req.query || {}
        }
      ]);
    }
  } catch (dbError) {
    console.error("Supabase Database Error:", dbError);
    // Do not return an error response; let the code proceed to serve the image
  }

  // A completely valid, raw 1x1 transparent GIF buffer data
  const base64Gif = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const pixelBuffer = Buffer.from(base64Gif, 'base64');

  // Strict image headers to prevent Vercel or browser caching
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Content-Length', pixelBuffer.length);
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Send the binary data
  return res.status(200).end(pixelBuffer);
}
