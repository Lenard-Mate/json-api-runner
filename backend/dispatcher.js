const express = require('express');
const mathService = require('./apis/mathService');
const router = express.Router();


router.get('/getFibonacci', async (req, res) => {
    const fibonacci = await mathService.getFibonacci(req.query.n);
    res.json(fibonacci);
});

module.exports = router;