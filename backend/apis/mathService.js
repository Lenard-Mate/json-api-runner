async function getFibonacci(n) {
    if (n < 0) throw new Error('Input must be a non-negative integer');
    if (n === 0) return 0;
    if (n === 1) return 1;

    const fib = [0, 1];
    for (let i = 2; i <= n; i++) {
        fib[i] = fib[i - 1] + fib[i - 2];
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    return fib[n];
}

async function multiplyMatrices(matrixA, matrixB) {

    if (!Array.isArray(matrixA) || !Array.isArray(matrixB) ||
        !Array.isArray(matrixA[0]) || !Array.isArray(matrixB[0])) {
        throw new Error("Both inputs must be nxn arrays (matrices).");
    }

    const rowsA = matrixA.length;
    const colsA = matrixA[0].length;
    const rowsB = matrixB.length;
    const colsB = matrixB[0].length;


    if (colsA !== rowsB) {
        throw new Error("Number of columns in A must equal number of rows in B.");
    }

    const result = Array.from({length: rowsA}, () => Array(colsB).fill(0));

    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            for (let k = 0; k < colsA; k++) {
                result[i][j] += matrixA[i][k] * matrixB[k][j];
            }
        }
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    return result;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {getFibonacci, multiplyMatrices};
