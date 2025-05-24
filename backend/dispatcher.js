const express = require('express');
const mathService = require('./apis/mathService');
const router = express.Router();


router.get('/getFibonacci', async (req, res) => {
    const fibonacci = await mathService.getFibonacci(req.query.n);
    res.json(fibonacci);
});

router.post('/multiplyMatrices', async (req, res) => {
    const { matrixA, matrixB } = req.body;
    if (!matrixA || !matrixB) {
        return res.status(400).json({ error: 'matrixA and matrixB are required' });
    }

    try {
        const result = await mathService.multiplyMatrices(matrixA, matrixB);
        res.json({ result });
    } catch (err) {
        res.status(500).json({ error: 'Matrix multiplication failed', details: err.message });
    }
});

module.exports = router;