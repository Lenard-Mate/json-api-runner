const path = require('path');
const fs = require('fs/promises');

const IMAGES_DIR = path.join(__dirname, '../public/images');

async function getImageByName(name) {
    const safeName = path.basename(name);
    const ext = path.extname(safeName).toLowerCase();
    const allowedExtensions = ['.png'];

    const finalName = ext ? safeName : safeName + '.png';
    const imagePath = path.join(IMAGES_DIR, finalName);

    if (!allowedExtensions.includes(path.extname(finalName))) {
        throw new Error('Invalid file extension');
    }

    try {
        await fs.access(imagePath);
        return await fs.readFile(imagePath);
    } catch (err) {
        return 'Image not found';
    }
}

module.exports = { getImageByName };