// api/track.js
import { supabase } from '../lib/supabase';

export default async function handler(req, res) {
  const data = {
    ip: req.headers['x-forawarded-for'] || 'unknown',
    user_agent: req.headers['user-agent'],
    query: req.query
  };

  await supabase.from('events').insert([data]);

  const pixel = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAASUVORK5CYII=',
    'base64'
  );

  res.setHeader('Content-Type', 'imsge/png');
  res.status(200).send(pixel);
}
  
