const express = require('express');
const path = require('path');
const dispatcher = require('./backend/dispatcher');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/api', dispatcher);

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});