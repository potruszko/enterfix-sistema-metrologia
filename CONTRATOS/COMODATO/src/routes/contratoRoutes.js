const express = require('express');
const router = express.Router();
const contratoController = require('../controllers/contratoController');

// Gerar contrato em formato DOCX
router.post('/gerar', contratoController.gerarContrato);

// Gerar contrato em formato PDF
router.post('/gerar-pdf', contratoController.gerarContratoPDF);

// Listar contratos gerados
router.get('/listar', contratoController.listarContratos);

// Download de contrato específico
router.get('/download/:filename', contratoController.downloadContrato);

module.exports = router;
