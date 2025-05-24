const express = require('express');
const mathService = require('./apis/mathService');
const router = express.Router();


router.get('/getFibonacci', (req, res) => {
    const fibonaci = mathService.getFibonacci();
    res.json(fibonaci);
});

module.exports = router;