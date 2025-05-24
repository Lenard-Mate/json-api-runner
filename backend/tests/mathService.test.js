const { getFibonacci, multiplyMatrices} = require('../apis/mathService');


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


describe('multiplyMatrices', () => {
    test('correctly multiplies two 3x3 matrices', async () => {
        const matrixA = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ];

        const matrixB = [
            [9, 8, 7],
            [6, 5, 4],
            [3, 2, 1]
        ];

        const expected = [
            [30, 24, 18],
            [84, 69, 54],
            [138, 114, 90]
        ];

        await expect(multiplyMatrices(matrixA, matrixB)).resolves.toEqual(expected);
    });

    test('throws error for incompatible matrix sizes', async () => {
        const matrixA = [[1, 2]];
        const matrixB = [[1, 2]]; // 1x2 * 1x2 = invalid

        await expect(multiplyMatrices(matrixA, matrixB)).rejects.toThrow("Number of columns in A must equal number of rows in B.");
    });

    test('throws error if input is not a 2D array', async () => {
        const matrixA = [1, 2, 3]; // Not 2D
        const matrixB = [[1, 2], [3, 4]];

        await expect(multiplyMatrices(matrixA, matrixB)).rejects.toThrow("Both inputs must be nxn arrays (matrices).");
    });
});
