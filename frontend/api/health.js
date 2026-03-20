import { setCors } from '../_db.js';

export default function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  res.json({ status: 'ok', version: '2.0.0' });
}
