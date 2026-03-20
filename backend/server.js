require('dotenv').config({
    path: require('path').join(__dirname, '.env')
});
const express = require('express');
const cors = require('cors');

const blanksRouter = require('./routes/blanks');
const hastesRouter = require('./routes/hastes');
const esferasRouter = require('./routes/esferas');
const maoDeObraRouter = require('./routes/maoDeObra');
const produtosRouter = require('./routes/produtos');
const composicoesRouter = require('./routes/composicoes');
const blingRouter = require('./routes/bling');
const configRouter = require('./routes/configuracoes');
const importarRouter = require('./routes/importar');
const centrosTrabalhoRouter = require('./routes/centros-trabalho');
const ordensProducaoRouter = require('./routes/ordens-producao');
const apontamentosRouter = require('./routes/apontamentos');

const app = express();

app.use(cors());
app.use(express.json());

// ─── ROTAS ───────────────────────────────────────────────────────────────────
app.use('/api/blanks', blanksRouter);
app.use('/api/hastes', hastesRouter);
app.use('/api/esferas', esferasRouter);
app.use('/api/mao-de-obra', maoDeObraRouter);
app.use('/api/produtos', produtosRouter);
app.use('/api/composicoes', composicoesRouter);
app.use('/api/bling', blingRouter);
app.use('/api/configuracoes', configRouter);
app.use('/api/importar', importarRouter);
app.use('/api/centros-trabalho', centrosTrabalhoRouter);
app.use('/api/ordens-producao', ordensProducaoRouter);
app.use('/api/apontamentos', apontamentosRouter);

// Health check
app.get('/api/health', (_req, res) => res.json({
    status: 'ok',
    version: '1.0.0'
}));

// Tratamento de erros genérico
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({
        erro: err.message || 'Erro interno do servidor'
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});