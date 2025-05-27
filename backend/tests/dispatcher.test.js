const request = require('supertest');
const express = require('express');
const router = require('../dispatcher');

jest.mock('../apis/mathService');
jest.mock('../apis/userService');
jest.mock('../apis/imageService');
jest.mock('../logger', () => ({ log: jest.fn() }));

const mathService = require('../apis/mathService');
const userService = require('../apis/userService');
const imageService = require('../apis/imageService');

const app = express();
app.use(express.json());
app.use('/', router);

describe('Dispatcher API routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /getUserProfile returns user data', async () => {
        userService.getUserProfile.mockResolvedValue({ email: 'test@example.com', name: 'Test' });

        const res = await request(app).get('/getUserProfile').query({ email: 'test@example.com' });

        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBe('test@example.com');
        expect(userService.getUserProfile).toHaveBeenCalledWith('test@example.com');
    });

    test('GET /getImageByName returns an image buffer', async () => {
        const mockImage = Buffer.from('image');
        imageService.getImageByName.mockResolvedValue(mockImage);

        const res = await request(app).get('/getImageByName').query({ name: 'logo' });

        expect(res.statusCode).toBe(200);
        expect(res.header['content-type']).toBe('image/png');
        expect(res.body).toEqual(mockImage);
    });

    test('GET /getFibonacci returns Fibonacci sequence', async () => {
        mathService.getFibonacci.mockResolvedValue([0, 1, 1, 2, 3]);

        const res = await request(app).get('/getFibonacci').query({ n: 5 });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([0, 1, 1, 2, 3]);
    });

    test('POST /multiplyMatrices returns multiplication result', async () => {
        mathService.multiplyMatrices.mockResolvedValue([[19, 22], [43, 50]]);

        const res = await request(app).post('/multiplyMatrices').send({
            matrixA: [[1, 2], [3, 4]],
            matrixB: [[5, 6], [7, 8]]
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.result).toEqual([[19, 22], [43, 50]]);
    });

    test('POST /multiplyMatrices returns 400 on missing matrix', async () => {
        const res = await request(app).post('/multiplyMatrices').send({ matrixA: [[1, 2]] });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('matrixA and matrixB are required');
    });

    test('POST /dispatcher handles all services and returns combined result', async () => {
        mathService.getFibonacci.mockResolvedValue([0, 1, 1]);
        mathService.multiplyMatrices.mockResolvedValue([[5]]);
        userService.getUserProfile.mockResolvedValue({ email: 'user@example.com', name: 'User' });
        imageService.getImageByName.mockResolvedValue(Buffer.from('image-buffer'));

        const res = await request(app).post('/dispatcher').send({
            fibonacci: { n: 3 },
            multiplyMatrices: { matrixA: [[1]], matrixB: [[5]] },
            userProfile: { email: 'user@example.com' },
            imageByName: { name: 'profile-pic' }
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.fibonacci).toEqual([0, 1, 1]);
        expect(res.body.matrix).toEqual([[5]]);
        expect(res.body.user).toEqual({ email: 'user@example.com', name: 'User' });
        expect(res.body.imageToReturn).toMatch(/^data:image\/png;base64,/);
    });

    test('POST /dispatcher returns 400 if matrixA or matrixB missing', async () => {
        const res = await request(app).post('/dispatcher').send({
            multiplyMatrices: { matrixA: [[1]] }
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('matrixA and matrixB are required');
    });

    test('POST /dispatcher handles partial request (only Fibonacci)', async () => {
        mathService.getFibonacci.mockResolvedValue([0, 1, 1]);

        const res = await request(app).post('/dispatcher').send({
            fibonacci: { n: 3 }
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.fibonacci).toEqual([0, 1, 1]);
        expect(res.body).not.toHaveProperty('matrix');
        expect(res.body).not.toHaveProperty('user');
        expect(res.body).not.toHaveProperty('imageToReturn');
    });
});
