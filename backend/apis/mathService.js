

async function getFibonacci(n) {
    if (n < 0) throw new Error('Input must be a non-negative integer');
    if (n === 0) return 0;
    if (n === 1) return 1;

    const fib = [0, 1];
    for (let i = 2; i <= n; i++) {
        fib[i] = fib[i - 1] + fib[i - 2];
    }
    return fib[n];
}

module.exports = { getFibonacci };