import { supabase } from '../lib/supabase';

export default async function handler(req, res) {
  try {
    console.log("Function started");
    
    const data = {
      ip: req.headers['x-forawarded-for'] || 'unknown',
      user_agent: req.headers['user-agent'],
      query: req.query
    };

   console.log("Data:", data);

    const {error } = await supabase.from('events').insert([data]);

    if (error) {
      console.log("Supabase error:", error);
      return res.status(500).json({ error }};
    }  

    console.log("Insert success");

    const pixel = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAASUVORK5CYII=',
      'base64'
    );

    res.setHeader('Content-Type', 'image/png');
    return res.status(200).send(pixel);
    
  } catch (err) {
    console.log("CRASH", err);
    return res.status(500).json({
      message: err.message,
      stack: err.stack
    });
  }
}  
  
