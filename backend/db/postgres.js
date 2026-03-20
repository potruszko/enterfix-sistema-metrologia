const {
    Pool
} = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
    console.error('PostgreSQL pool error:', err.message);
});

// Testa a conexão na inicialização
pool.connect()
    .then(client => {
        console.log('✅ Supabase PostgreSQL conectado');
        client.release();
    })
    .catch(err => {
        console.error('❌ Falha ao conectar no Supabase:', err.message);
    });

/**
 * Helper: executa uma query e retorna as linhas.
 * Substitui db.prepare().all() do SQLite.
 */
async function query(sql, params = []) {
    const result = await pool.query(sql, params);
    return result.rows;
}

/**
 * Helper: executa uma query e retorna a primeira linha.
 * Substitui db.prepare().get() do SQLite.
 */
async function queryOne(sql, params = []) {
    const result = await pool.query(sql, params);
    return result.rows[0] || null;
}

/**
 * Helper: executa um INSERT/UPDATE/DELETE.
 * Substitui db.prepare().run() do SQLite.
 * Para INSERTs com RETURNING id, usa queryOne().
 */
async function run(sql, params = []) {
    const result = await pool.query(sql, params);
    return result;
}

module.exports = {
    pool,
    query,
    queryOne,
    run
};