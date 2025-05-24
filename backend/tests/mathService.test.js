const { getFibonacci } = require('../apis/mathService');

describe('getFibonacci', () => {
    test('returns 0 for input 0', async () => {
        const result = await getFibonacci(0);
        expect(result).toBe(0);
    });

    test('returns 1 for input 1', async () => {
        const result = await getFibonacci(1);
        expect(result).toBe(1);
    });

    test('returns 5 for input 5', async () => {
        const result = await getFibonacci(5);
        expect(result).toBe(5);
    });

    test('throws error for negative input', async () => {
        await expect(getFibonacci(-1)).rejects.toThrow('Input must be a non-negative integer');
    });
});