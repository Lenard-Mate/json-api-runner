const express = require('express');
const mathService = require('./apis/mathService');
const {log} = require("./logger");
const router = express.Router();


router.get('/getFibonacci', async (req, res) => {
    const fibonacci = await mathService.getFibonacci(req.query.n);
    log('info', `GET /getFibonacci - n=${req.query.n} - Success`);
    res.json(fibonacci);
});

router.post('/multiplyMatrices', async (req, res) => {
    const { matrixA, matrixB } = req.body;
    if (!matrixA || !matrixB) {
        log('error', `POST /multiplyMatrices - matrixA=${matrixA} - matrixB=${matrixB} - Error: matrixA and matrixB are required`);
        return res.status(400).json({ error: 'matrixA and matrixB are required' });
    }

    try {
        const result = await mathService.multiplyMatrices(matrixA, matrixB);
        log('info', `POST /multiplyMatrices - matrixA=${matrixA} - matrixB=${matrixB} - Success`);
        res.json({ result });
    } catch (err) {
        log('error', `POST /multiplyMatrices - matrixA=${matrixA} - matrixB=${matrixB} - Error: ${err.message}`);
        res.status(500).json({ error: 'Matrix multiplication failed', details: err.message });
    }
});

module.exports = router;