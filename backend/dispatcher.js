const express = require('express');
const mathService = require('./apis/mathService');
const userService = require('./apis/userService');
const imageService = require('./apis/imageService');
const {log} = require("./logger");
const router = express.Router();

router.get('/getUserProfile', async (req, res) => {
    const userData = await userService.getUserProfile(req.query.email);
    log('info', `GET /getUserProfile - userData=${userData.email} - Success`);
    res.json(userData);
});

router.get('/getImageByName', async (req, res) => {
    try {
        const image = await imageService.getImageByName(String(req.query.name));
        if (typeof image === 'string') {
            log('warn', `GET /getImageByName - Image not found: ${req.query.name}`);
            return res.status(404).json({ error: image });
        }

        const base64Image = image.toString('base64');
        log('info', `GET /getImageByName - We have image - Success`);
        return res.json({ image: base64Image, contentType: 'image/png' });
    } catch (error) {
        log('error', `GET /getImageByName - Error: ${error.message}`);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/getFibonacci', async (req, res) => {
    const fibonacci = await mathService.getFibonacci(req.query.n);
    log('info', `GET /getFibonacci - n=${req.query.n} - Success`);
    const responseValue = {"fibonacci":fibonacci}
    res.json(responseValue);
});

router.post('/multiplyMatrices', async (req, res) => {
    const {matrixA, matrixB} = req.body;
    if (!matrixA || !matrixB) {
        log('error', `POST /multiplyMatrices - matrixA=${matrixA} - matrixB=${matrixB} - Error: matrixA and matrixB are required`);
        return res.status(400).json({error: 'matrixA and matrixB are required'});
    }

    try {
        const result = await mathService.multiplyMatrices(matrixA, matrixB);
        log('info', `POST /multiplyMatrices - matrixA=${matrixA} - matrixB=${matrixB} - Success`);
        res.json({result});
    } catch (err) {
        log('error', `POST /multiplyMatrices - matrixA=${matrixA} - matrixB=${matrixB} - Error: ${err.message}`);
        res.status(500).json({error: 'Matrix multiplication failed', details: err.message});
    }
});

router.post('/dispatcher', async (req, res) => {
    const {fibonacci = {}, multiplyMatrices = {}, imageByName = {}, userProfile = {}} = req.body;

    const result = {};
    const tasks = [];
    const taskIndices = {};

    if (Object.keys(fibonacci).length > 0) {
        taskIndices.fibonacci = tasks.length;
        tasks.push(mathService.getFibonacci(fibonacci.n));
    }

    if (Object.keys(multiplyMatrices).length > 0) {
        const {matrixA, matrixB} = multiplyMatrices;
        if (!matrixA || !matrixB) {
            log('error', `POST /multiplyMatrices - matrixA=${matrixA} - matrixB=${matrixB} - Error: matrixA and matrixB are required`);
            return res.status(400).json({ error: 'matrixA and matrixB are required' });
        }
        taskIndices.matrix = tasks.length;
        tasks.push(mathService.multiplyMatrices(matrixA, matrixB));
    }

    if (Object.keys(userProfile).length > 0) {
        taskIndices.user = tasks.length;
        tasks.push(userService.getUserProfile(userProfile.email));
    }

    if (Object.keys(imageByName).length > 0) {
        taskIndices.image = tasks.length;
        tasks.push(imageService.getImageByName(String(imageByName.name)));
    }

    try {
        const responses = await Promise.all(tasks);

        if (taskIndices.fibonacci !== undefined) {
            result.fibonacci = responses[taskIndices.fibonacci];
        }

        if (taskIndices.matrix !== undefined) {
            result.matrix = responses[taskIndices.matrix];
        }

        if (taskIndices.user !== undefined) {
            result.user = responses[taskIndices.user];
        }

        if (taskIndices.image !== undefined) {
            const image = responses[taskIndices.image];
            if (image) {
                const base64Image = image.toString('base64');
                result.imageToReturn = `data:image/png;base64,${base64Image}`;
            }
        }

        log('info', `POST /dispatcher - Solve elements in the array - Success`);
        res.json(result);

    } catch (err) {
        log('error', `POST /dispatcher - Solve elements in the array - Error: ${err.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;