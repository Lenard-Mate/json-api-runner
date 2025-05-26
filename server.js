const express = require('express');
const path = require('path');
const dispatcher = require('./backend/dispatcher');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/icons', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font')));
app.use('/prismjs', express.static(path.join(__dirname, 'node_modules/prismjs')));

app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/api', dispatcher);

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});