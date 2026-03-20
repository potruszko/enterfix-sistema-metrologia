import pkg from 'pg';
const { Pool } = pkg;

let _pool;

function getPool() {
  if (!_pool) {
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }
  return _pool;
}

export async function query(sql, params = []) {
  const result = await getPool().query(sql, params);
  return result.rows;
}

export async function queryOne(sql, params = []) {
  const result = await getPool().query(sql, params);
  return result.rows[0] || null;
}

export function getPool2() {
  return getPool();
}

export function setCors(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
