const { parentPort } = require('worker_threads');

parentPort.on('message', (task) => {
    const start = Date.now();
    try {
        if (task.type === 'cpu') {
            // CPU bound task: calculate a large sum
            let sum = 0;
            for(let i=0; i<task.param * 10000; i++) {
                sum += Math.sqrt(i);
            }
            const end = Date.now();
            parentPort.postMessage({ id: task.id, status: 'completed', duration: end - start, result: sum });
        } else if (task.type === 'io') {
            // I/O bound task: simulate delay
            setTimeout(() => {
                const end = Date.now();
                parentPort.postMessage({ id: task.id, status: 'completed', duration: end - start, result: 'io-done' });
            }, task.param);
        }
    } catch (err) {
        parentPort.postMessage({ id: task.id, status: 'error', error: err.message });
    }
});
