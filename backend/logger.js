const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'logs', 'app.log');

if (!fs.existsSync(path.dirname(logFilePath))) {
    fs.mkdirSync(path.dirname(logFilePath), {recursive: true});
}

function getTimestamp() {
    return new Date().toISOString();
}

/**
 * Logs a message with a timestamp to console and file.
 * @param {'info'|'warn'|'error'} level - Log level
 * @param {string} message - Message to log
 */
function log(level, message) {
    const timestamp = getTimestamp();
    const formattedMessage = `${timestamp} [${level.toUpperCase()}] ${message}`;

    if (level === 'error') {
        console.error(formattedMessage);
    } else if (level === 'warn') {
        console.warn(formattedMessage);
    } else {
        console.log(formattedMessage);
    }

    fs.appendFile(logFilePath, formattedMessage + '\n', err => {
        if (err) console.error('Failed to write log:', err);
    });
}

module.exports = {log};