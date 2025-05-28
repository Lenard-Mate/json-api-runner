const path = require('path');
const fs = require('fs/promises');
const { getImageByName } = require('../apis/imageService');

jest.mock('fs/promises');

describe('getImageByName', () => {
    const validImageName = 'test-image.png';
    const invalidExtensionImage = 'test-image.jpg';
    const noExtensionImage = 'test-image';
    const mockImageData = Buffer.from('fake-image-data');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return image data for valid PNG file', async () => {
        fs.access.mockResolvedValue(undefined);
        fs.readFile.mockResolvedValue(mockImageData);

        const result = await getImageByName(validImageName);

        expect(result).toBe(mockImageData);
        expect(fs.access).toHaveBeenCalledTimes(1);
        expect(fs.readFile).toHaveBeenCalledTimes(1);
    });

    test('should append .png extension when no extension provided', async () => {
        fs.access.mockResolvedValue(undefined);
        fs.readFile.mockResolvedValue(mockImageData);

        await getImageByName(noExtensionImage);

        const expectedPath = expect.stringContaining(`${noExtensionImage}.png`);
        expect(fs.access).toHaveBeenCalledWith(expectedPath);
        expect(fs.readFile).toHaveBeenCalledWith(expectedPath);
    });

    test('should throw error for invalid file extension', async () => {
        await expect(getImageByName(invalidExtensionImage))
            .rejects
            .toThrow('Invalid file extension');

        expect(fs.access).not.toHaveBeenCalled();
        expect(fs.readFile).not.toHaveBeenCalled();
    });

    test('should return "Image not found" string when file does not exist', async () => {
        fs.access.mockRejectedValue(new Error('File not found'));

        const result = await getImageByName(validImageName);

        expect(fs.access).toHaveBeenCalledTimes(1);
        expect(fs.readFile).not.toHaveBeenCalled();
        expect(result).toBe('Image not found');
    });

    test('should sanitize path traversal attempts', async () => {
        const maliciousPath = '../../../etc/passwd.png';
        fs.access.mockResolvedValue(undefined);
        fs.readFile.mockResolvedValue(mockImageData);

        await getImageByName(maliciousPath);

        const calledPath = fs.access.mock.calls[0][0];
        expect(calledPath).toEqual(expect.stringContaining('passwd.png'));
        expect(calledPath).not.toMatch(/\.\./);

        const readPath = fs.readFile.mock.calls[0][0];
        expect(readPath).toEqual(expect.stringContaining('passwd.png'));
        expect(readPath).not.toMatch(/\.\./);
    });
});
